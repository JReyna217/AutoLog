import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

import { FuelLogService } from '../../../core/services/fuel-log';


import { FuelLogResponse } from '../../../core/models/fuel-log.model';
import { VehicleResponse } from '../../../core/models/vehicle.model';
import { PRIME_FUEL_IMPORTS } from '../../../core/shared/ui/primeng-imports';
import { ExchangeRateService } from '../../../core/services/exchange-rate';
import { VehicleService } from '../../../core/services/vehicle';

@Component({
  selector: 'app-fuel-log-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ...PRIME_FUEL_IMPORTS],
  providers: [MessageService, ConfirmationService],
  templateUrl: './fuel-log-list.html'
})
export class FuelLogList implements OnInit {
  private fuelLogService = inject(FuelLogService);
  private vehicleService = inject(VehicleService);
  private exchangeRateService = inject(ExchangeRateService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  vehicles: VehicleResponse[] = [];
  selectedVehicleId: number | null = null;
  
  logs: FuelLogResponse[] = [];
  isLoading = false;
  isSaving = false;
  showDialog = false;
  isEditMode = false;
  selectedLogId: number = 0;

  // Options for SelectButtons (Toggles)
  distanceOptions = [{ label: 'KM', value: false }, { label: 'Miles', value: true }];
  volumeOptions = [{ label: 'Liters', value: false }, { label: 'Gallons', value: true }];
  currencyOptions = [{ label: 'MXN', value: false }, { label: 'USD', value: true }];
  tankOptions = [{ label: 'Partial', value: false }, { label: 'Full Tank', value: true }];

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
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load vehicles.' })
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load fuel logs.' });
        this.isLoading = false;
      }
    });
  }

  openNew() {
    if (!this.selectedVehicleId) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Select a vehicle first.' });
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
      message: 'Are you sure you want to delete this fuel record?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.fuelLogService.delete(log.id).subscribe({
          next: () => {
            this.logs = this.logs.filter(l => l.id !== log.id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted.' });
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
          this.finishSave('Record updated.');
        },
        error: () => this.handleError()
      });
    } else {
      this.fuelLogService.create(requestData).subscribe({
        next: () => {
          this.loadLogs();
          this.finishSave('Fuel log added successfully.');
        },
        error: () => this.handleError()
      });
    }
  }

  get isPaidInUsd(): boolean {
    return this.logForm.get('isPaidInUsd')?.value || false;
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