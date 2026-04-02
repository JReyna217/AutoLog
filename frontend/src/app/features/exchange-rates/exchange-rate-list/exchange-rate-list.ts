import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExchangeRateService } from '../../../core/services/exchange-rate';
import { ExchangeRateResponse } from '../../../core/models/exchange-rate.model';
import { PRIME_EXCHANGE_IMPORTS } from '../../../core/shared/ui/primeng-imports';

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

  rateForm = this.fb.nonNullable.group({
    date: [new Date(), Validators.required],
    usdToMxnRate: [0, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit() {
    this.loadRates();
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
    this.rateForm.reset({ date: new Date(), usdToMxnRate: 0 });
    this.showDialog = true;
  }

  editRate(rate: ExchangeRateResponse) {
    this.isEditMode = true;
    this.selectedRateId = rate.id;
    
    // Parse the YYYY-MM-DD string into a local JS Date object avoiding timezone shifts
    const [year, month, day] = rate.date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);

    this.rateForm.patchValue({
      date: localDate,
      usdToMxnRate: rate.usdToMxnRate
    });

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
    
    // Extract values and format the Date object back to "YYYY-MM-DD"
    const formValues = this.rateForm.getRawValue();
    const dateObj = formValues.date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    const requestData = {
      date: `${year}-${month}-${day}`,
      usdToMxnRate: formValues.usdToMxnRate
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