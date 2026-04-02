import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VehicleService } from '../../../core/services/vehicle';
import { VehicleResponse } from '../../../core/models/vehicle.model';
import { PRIME_VEHICLE_IMPORTS } from '../../../core/shared/ui/primeng-imports';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...PRIME_VEHICLE_IMPORTS],
  providers: [MessageService, ConfirmationService],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss'
})
export class VehicleList implements OnInit {
  private vehicleService = inject(VehicleService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  vehicles: VehicleResponse[] = [];
  isLoading = true;
  isSaving = false;
  showDialog = false;
  
  isEditMode = false;
  selectedVehicleId: number = 0;

  vehicleForm = this.fb.nonNullable.group({
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2100)]],
    cylinders: [4, [Validators.required, Validators.min(2), Validators.max(16)]],
    engineType: ['', Validators.required],
    fuelType: ['', Validators.required],
    color: ['']
  });

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.isLoading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load vehicles.' });
        this.isLoading = false;
      }
    });
  }

  openNew() {
    this.isEditMode = false;
    this.selectedVehicleId = 0;
    this.vehicleForm.reset({ year: new Date().getFullYear(), cylinders: 4 });
    this.showDialog = true;
  }

  editVehicle(vehicle: VehicleResponse) {
    this.isEditMode = true;
    this.selectedVehicleId = vehicle.id;
    
    this.vehicleForm.patchValue({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      cylinders: vehicle.cylinders,
      engineType: vehicle.engineType,
      fuelType: vehicle.fuelType,
      color: vehicle.color
    });

    this.showDialog = true;
  }

  deleteVehicle(vehicle: VehicleResponse) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete your ${vehicle.year} ${vehicle.make} ${vehicle.model}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-info p-button-outlined',
      accept: () => {
        this.vehicleService.deleteVehicle(vehicle.id).subscribe({
          next: () => {
            this.vehicles = this.vehicles.filter(v => v.id !== vehicle.id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vehicle deleted successfully' });
          },
          error: () => this.handleError()
        });
      }
    });
  }

  hideDialog() {
    this.showDialog = false;
  }

  saveVehicle() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const vehicleData = this.vehicleForm.getRawValue();

    if (this.isEditMode && this.selectedVehicleId) {
      this.vehicleService.updateVehicle(this.selectedVehicleId, vehicleData).subscribe({
        next: () => {
          const index = this.vehicles.findIndex(v => v.id === this.selectedVehicleId);
          if (index !== -1) {
            this.vehicles[index] = { ...vehicleData, id: this.selectedVehicleId };
          }
          this.finishSave('Vehicle updated successfully');
        },
        error: () => this.handleError()
      });
    } else {
      this.vehicleService.createVehicle(vehicleData).subscribe({
        next: (newVehicle) => {
          this.vehicles.unshift(newVehicle);
          this.finishSave('Vehicle added successfully');
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