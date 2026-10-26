import { Component, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language';

import { FuelLogService } from '../../../core/services/fuel-log';


import { FuelLogResponse } from '../../../core/models/fuel-log.model';
import { VehicleResponse } from '../../../core/models/vehicle.model';
import { PRIME_FUEL_IMPORTS } from '../../../core/shared/ui/primeng-imports';
import { ExchangeRateService } from '../../../core/services/exchange-rate';
import { VehicleService } from '../../../core/services/vehicle';

@Component({
  selector: 'app-fuel-log-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslatePipe, ...PRIME_FUEL_IMPORTS],
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './fuel-log-list.html'
})
export class FuelLogList implements OnInit {
  private fuelLogService = inject(FuelLogService);
  private vehicleService = inject(VehicleService);
  private exchangeRateService = inject(ExchangeRateService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private translate = inject(TranslateService);

  /** Active language; used for locale-aware date formatting and reactive option labels. */
  readonly lang = inject(LanguageService).current;

  vehicles: VehicleResponse[] = [];
  selectedVehicleId: number | null = null;
  
  logs: FuelLogResponse[] = [];
  isLoading = false;
  isSaving = false;
  showDialog = false;
  isEditMode = false;
  selectedLogId: number = 0;

  // Options for SelectButtons (Toggles)
  // Labels are computed so they re-translate when the language changes (ISO currency codes stay as-is)
  distanceOptions = computed(() => {
    this.lang();
    return [
      { label: this.translate.instant('fuelLogs.options.km'), value: false },
      { label: this.translate.instant('fuelLogs.options.miles'), value: true }
    ];
  });
  volumeOptions = computed(() => {
    this.lang();
    return [
      { label: this.translate.instant('fuelLogs.options.liters'), value: false },
      { label: this.translate.instant('fuelLogs.options.gallons'), value: true }
    ];
  });
  currencyOptions = [{ label: 'MXN', value: false }, { label: 'USD', value: true }];
  tankOptions = computed(() => {
    this.lang();
    return [
      { label: this.translate.instant('fuelLogs.options.partial'), value: false },
      { label: this.translate.instant('fuelLogs.options.fullTank'), value: true }
    ];
  });

  // Form initialization using null for numbers so FloatLabels stay down
  logForm = this.fb.group({
    fillUpDate: [new Date(), Validators.required],
    isOdometerInMiles: [false],
    currentOdometer: [null as number | null, [Validators.required, Validators.min(0)]],
    isVolumeInGallons: [false],
    inputVolume: [null as number | null, [Validators.required, Validators.min(0.1)]],
    isPaidInUsd: [false],
    inputCost: [null as number | null, [Validators.required, Validators.min(0)]],
    appliedExchangeRate: [null as number | null], 
    isFullTank: [true],
    notes: ['']
  });

  ngOnInit() {
    this.loadVehicles();
    this.setupDateListener();
  }

  setupDateListener() {
  this.logForm.get('fillUpDate')?.valueChanges.subscribe(date => {
    if (date instanceof Date) {
      this.fetchExchangeRate(date);
    }
  });
}

  fetchExchangeRate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  this.exchangeRateService.getByDate(dateStr).subscribe({
    next: (rate) => {
      if (rate) {
        this.logForm.patchValue({ appliedExchangeRate: rate.usdToMxnRate });
      } else {
        this.logForm.patchValue({ appliedExchangeRate: null });
      }
    },
    error: () => {
      this.logForm.patchValue({ appliedExchangeRate: null });
    }
  });
}

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        if (this.vehicles.length > 0) {
          this.selectedVehicleId = this.vehicles[0].id;
          this.loadLogs();
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: this.translate.instant('common.status.error'), detail: this.translate.instant('fuelLogs.toast.loadVehiclesError') })
    });
  }

  onVehicleChange() {
    this.loadLogs();
  }

  loadLogs() {
    if (!this.selectedVehicleId) return;
    
    this.isLoading = true;
    this.fuelLogService.getByVehicle(this.selectedVehicleId).subscribe({
      next: (data) => {
        this.logs = data;
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: this.translate.instant('common.status.error'), detail: this.translate.instant('fuelLogs.toast.loadLogsError') });
        this.isLoading = false;
      }
    });
  }

  openNew() {
    if (!this.selectedVehicleId) {
      this.messageService.add({ severity: 'warn', summary: this.translate.instant('common.status.warning'), detail: this.translate.instant('fuelLogs.toast.selectVehicleFirst') });
      return;
    }
    this.isEditMode = false;
    this.selectedLogId = 0;
    
    const today = new Date();
    this.logForm.reset({ 
      fillUpDate: today, 
      isOdometerInMiles: false,
      currentOdometer: null,
      isVolumeInGallons: false,
      inputVolume: null,
      isPaidInUsd: false,
      inputCost: null,
      isFullTank: true,
      appliedExchangeRate: null,
      notes: ''
    });

    // Fetch rate for today immediately upon opening
    this.fetchExchangeRate(today);
    
    this.showDialog = true;
  }

  deleteLog(log: FuelLogResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant('fuelLogs.confirmDelete'),
      header: this.translate.instant('common.confirm.deleteHeader'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.fuelLogService.delete(log.id).subscribe({
          next: () => {
            this.logs = this.logs.filter(l => l.id !== log.id);
            this.messageService.add({ severity: 'success', summary: this.translate.instant('common.status.success'), detail: this.translate.instant('fuelLogs.toast.deleted') });
          },
          error: () => this.handleError()
        });
      }
    });
  }

  hideDialog() {
    this.showDialog = false;
  }

  saveLog() {
    if (this.logForm.invalid || !this.selectedVehicleId) {
      this.logForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValues = this.logForm.getRawValue();
    
    const dateObj = formValues.fillUpDate!;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    const safeDateString = `${year}-${month}-${day}T12:00:00Z`;

    const requestData = {
      vehicleId: this.selectedVehicleId,
      fillUpDate: safeDateString,
      isOdometerInMiles: formValues.isOdometerInMiles ?? false,
      currentOdometer: formValues.currentOdometer ?? 0,
      isVolumeInGallons: formValues.isVolumeInGallons ?? false,
      inputVolume: formValues.inputVolume ?? 0,
      isPaidInUsd: formValues.isPaidInUsd ?? false,
      inputCost: formValues.inputCost ?? 0,
      appliedExchangeRate: formValues.isPaidInUsd ? formValues.appliedExchangeRate : null,
      isFullTank: formValues.isFullTank ?? true,
      notes: formValues.notes ?? ''
    };

    if (this.isEditMode && this.selectedLogId) {
      this.fuelLogService.update(this.selectedLogId, requestData).subscribe({
        next: () => {
          this.loadLogs();
          this.finishSave(this.translate.instant('fuelLogs.toast.updated'));
        },
        error: () => this.handleError()
      });
    } else {
      this.fuelLogService.create(requestData).subscribe({
        next: () => {
          this.loadLogs();
          this.finishSave(this.translate.instant('fuelLogs.toast.added'));
        },
        error: () => this.handleError()
      });
    }
  }

  get isPaidInUsd(): boolean {
    return this.logForm.get('isPaidInUsd')?.value || false;
  }

  private finishSave(message: string) {
    this.messageService.add({ severity: 'success', summary: this.translate.instant('common.status.success'), detail: message });
    this.isSaving = false;
    this.showDialog = false;
  }

  private handleError() {
    this.messageService.add({ severity: 'error', summary: this.translate.instant('common.status.error'), detail: this.translate.instant('common.messages.operationFailed') });
    this.isSaving = false;
  }
}