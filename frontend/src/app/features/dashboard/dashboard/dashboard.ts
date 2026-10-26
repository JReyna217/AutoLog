import { Component, DestroyRef, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DashboardService } from '../../../core/services/dashboard';
import { VehicleService } from '../../../core/services/vehicle';
import { VehicleResponse } from '../../../core/models/vehicle.model';
import { DashboardSummaryResponse } from '../../../core/models/dashboard.model';
import { DASHBOARD_IMPORTS } from '../../../core/shared/ui/primeng-imports';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, ...DASHBOARD_IMPORTS],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private vehicleService = inject(VehicleService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  vehicles: VehicleResponse[] = [];
  selectedVehicleId: number | null = null;
  selectedDate: Date = new Date(); 
  summary?: DashboardSummaryResponse;

  lineChartData: any;
  barChartData: any;
  spendChartData: any;
  exchangeRateChartData: any;
  chartOptions: any;

  ngOnInit() {
    this.initChartOptions();
    this.loadVehicles();

    // Chart dataset labels are plain strings (not template-bound), so rebuild them on language change
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.buildCharts());
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe(data => {
      this.vehicles = data;
      if (this.vehicles.length > 0) {
        this.selectedVehicleId = this.vehicles[0].id;
        this.refreshDashboard();
      }
    });
  }

  refreshDashboard() {
    const month = this.selectedDate.getMonth() + 1;
    const year = this.selectedDate.getFullYear();

    this.dashboardService.getSummary(this.selectedVehicleId, month, year).subscribe(data => {
      this.summary = data;
      this.buildCharts();
    });
  }

  initChartOptions() {
    this.chartOptions = {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#f3f4f6' } }
      },
      tension: 0.4 // Makes the lines curved
    };
  }

  buildCharts() {
    if (!this.summary) return;
    const documentStyle = getComputedStyle(document.documentElement);

    // Line: Complete Historical Performance
    this.lineChartData = {
      labels: this.summary.fullEfficiencyHistory.map(f => new Date(f.date).toLocaleDateString()),
      datasets: [{
        label: this.translate.instant('dashboard.charts.datasets.kmPerLiter'),
        data: this.summary.fullEfficiencyHistory.map(f => f.kmL),
        borderColor: documentStyle.getPropertyValue('--blue-500'),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true
      }]
    };

    // Bars: Year-over-Year Comparison
    this.barChartData = {
      labels: this.summary.annualEfficiencyComparison.map(a => `${a.month.toString().padStart(2, '0')}/${a.year}`),
      datasets: [{
        label: this.translate.instant('dashboard.charts.datasets.avgKmPerLiter'),
        data: this.summary.annualEfficiencyComparison.map(a => a.averageKmL),
        backgroundColor: documentStyle.getPropertyValue('--blue-500')
      }]
    };

    // Bars: Monthly Expenses
    this.spendChartData = {
      labels: this.summary.monthlySpendingHistory.map(s => s.label),
      datasets: [{
        label: this.translate.instant('dashboard.charts.datasets.spending'),
        data: this.summary.monthlySpendingHistory.map(s => s.value),
        backgroundColor: documentStyle.getPropertyValue('--green-500')
      }]
    };

    // Line: Exchange Rate History
    this.exchangeRateChartData = {
      labels: this.summary.exchangeRateHistory.map(e => e.label),
      datasets: [{
        label: this.translate.instant('dashboard.charts.datasets.exchangeRate'),
        data: this.summary.exchangeRateHistory.map(e => e.value),
        borderColor: documentStyle.getPropertyValue('--orange-500'),
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        fill: true
      }]
    };
  }
}