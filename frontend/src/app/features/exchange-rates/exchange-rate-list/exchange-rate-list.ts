import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExchangeRateService } from '../../../core/services/exchange-rate';
import { ExchangeRateResponse } from '../../../core/models/exchange-rate.model';
import { PRIME_EXCHANGE_IMPORTS } from '../../../core/shared/ui/primeng-imports';

// RxJS imports for DOF reactivity
import { debounceTime, filter, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-exchange-rate-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...PRIME_EXCHANGE_IMPORTS],
  providers: [MessageService, ConfirmationService],
  templateUrl: './exchange-rate-list.html'
})
export class ExchangeRateList implements OnInit {
  private exchangeRateService = inject(ExchangeRateService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  rates: ExchangeRateResponse[] = [];
  isLoading = true;
  isSaving = false;
  showDialog = false;
  isEditMode = false;
  selectedRateId: number = 0;
  
  // Flag to display the spinner in the UI while fetching official data
  isFetchingDof = false;

  // We removed the global nonNullable to allow null values and fix the PrimeNG FloatLabel overlap issue
  rateForm = this.fb.group({
    date: [new Date(), Validators.required],
    usdToMxnRate: [null as number | null, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit() {
    this.loadRates();
    this.setupDofListener(); // Initialize the DOF reactive listener
  }

  setupDofListener() {
    this.rateForm.get('date')?.valueChanges.pipe(
      // Wait 300ms after the user stops changing the date before triggering the API call
      debounceTime(300), 
      // Type Guard: Explicitly tells TypeScript that downstream 'val' is strictly a Date object
      filter((val): val is Date => val instanceof Date && !isNaN(val.getTime())),
      switchMap((date: Date) => {
        this.isFetchingDof = true;
        
        // Format the date to match the API expectation (YYYY-MM-DD)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        console.log(dateString);

        return this.exchangeRateService.getDofRate(dateString).pipe(
          // Catch errors silently to prevent the observable stream from dying on a 404 or network issue
          catchError(() => of(null)) 
        );
      })
    ).subscribe((response) => {
      this.isFetchingDof = false;

      if (response && response.rateValue) {
        // Official rate found, auto-fill the form field
        this.rateForm.patchValue({ usdToMxnRate: response.rateValue });
        this.messageService.add({ severity: 'info', summary: 'DOF Sync', detail: 'Official rate auto-filled.' });
      } else {
        // No official rate available, clear the field for manual entry
        this.rateForm.patchValue({ usdToMxnRate: null });
        this.messageService.add({ severity: 'warn', summary: 'No Data', detail: 'No official rate found for this date. Enter manually.' });
      }
    });
  }

  loadRates() {
    this.isLoading = true;
    this.exchangeRateService.getRates().subscribe({
      next: (data) => {
        this.rates = data;
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load exchange rates.' });
        this.isLoading = false;
      }
    });
  }

  openNew() {
    this.isEditMode = false;
    this.selectedRateId = 0;
    
    // Resetting the date to "today" triggers valueChanges, which automatically fetches today's rate
    this.rateForm.reset({ date: new Date(), usdToMxnRate: null });
    this.showDialog = true;
  }

  editRate(rate: ExchangeRateResponse) {
    this.isEditMode = true;
    this.selectedRateId = rate.id;
    
    // Parse the YYYY-MM-DD string into a local JS Date object to avoid timezone shifting bugs
    const [year, month, day] = rate.date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);

    // CRITICAL FIX: emitEvent: false prevents the date change from triggering the DOF API call,
    // ensuring we don't accidentally overwrite the user's previously saved manual rate.
    this.rateForm.patchValue({
      date: localDate,
      usdToMxnRate: rate.usdToMxnRate
    }, { emitEvent: false });

    this.showDialog = true;
  }

  deleteRate(rate: ExchangeRateResponse) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the rate for ${rate.date}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.exchangeRateService.deleteRate(rate.id).subscribe({
          next: () => {
            this.rates = this.rates.filter(r => r.id !== rate.id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Rate deleted successfully' });
          },
          error: () => this.handleError()
        });
      }
    });
  }

  hideDialog() {
    this.showDialog = false;
  }

  saveRate() {
    if (this.rateForm.invalid) {
      this.rateForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    
    // Extract values and format the Date object back to the standard "YYYY-MM-DD" before sending to API
    const formValues = this.rateForm.getRawValue();
    const dateObj = formValues.date!;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    const requestData = {
      date: `${year}-${month}-${day}`,
      usdToMxnRate: formValues.usdToMxnRate!
    };

    if (this.isEditMode && this.selectedRateId) {
      this.exchangeRateService.updateRate(this.selectedRateId, requestData).subscribe({
        next: () => {
          const index = this.rates.findIndex(r => r.id === this.selectedRateId);
          if (index !== -1) {
            this.rates[index] = { ...requestData, id: this.selectedRateId };
          }
          this.finishSave('Exchange rate updated successfully');
        },
        error: () => this.handleError()
      });
    } else {
      this.exchangeRateService.createRate(requestData).subscribe({
        next: (newRate) => {
          this.rates.unshift(newRate);
          this.finishSave('Exchange rate added successfully');
        },
        error: () => this.handleError()
      });
    }
  }

  private finishSave(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
    this.isSaving = false;
    this.showDialog = false;
  }

  private handleError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed.' });
    this.isSaving = false;
  }
}