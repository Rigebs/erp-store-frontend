import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DashboardService } from '../services/dashboard.service';
import { DashboardSummary } from '../models/dashboard-summary';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // KPI
  totalSales = 0;
  totalTransactions = 0;
  avgTicket = 0;

  // Charts
  public salesByDateData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public salesByDateOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: { x: {}, y: { beginAtZero: true } },
  };

  public salesByCashierData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public salesByCashierOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ': ' + context.formattedValue;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value: any) {
            const label = this.getLabelForValue(value) as string;
            const maxLength = 12;
            return label.length > maxLength
              ? label.slice(0, maxLength) + '...'
              : label;
          },
        },
      },
      y: { beginAtZero: true },
    },
  };

  // Tables
  topProducts: any[] = [];
  lowStock: any[] = [];
  topCustomers: any[] = [];

  isLoading = false;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchDashboard();
  }

  fetchDashboard(startDate?: string, endDate?: string) {
    this.isLoading = true;
    // Por defecto traemos últimos 7 días si no se pasan fechas
    const today = new Date();
    const start =
      startDate ??
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
        .toISOString()
        .split('T')[0];
    const end = endDate ?? today.toISOString().split('T')[0];

    this.dashboardService.getDashboardSummary(start, end).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadDashboard(res.data);
        } else {
          this.errorMessage = res.message;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el dashboard';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  loadDashboard(data: DashboardSummary) {
    // KPIs
    this.totalSales = data.salesKpis.totalSales;
    this.totalTransactions = data.salesKpis.totalTransactions;
    this.avgTicket = data.salesKpis.avgTicket;

    // Sales by Date chart
    this.salesByDateData.labels = data.salesKpis.salesByDate.map((s) => s.date);
    this.salesByDateData.datasets = [
      {
        data: data.salesKpis.salesByDate.map((s) => s.total),
        label: 'Ventas por Fecha',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ];

    // Sales by Cashier chart
    this.salesByCashierData.labels = data.salesByCashier.map(
      (c) => c.cashierName
    );
    this.salesByCashierData.datasets = [
      {
        data: data.salesByCashier.map((c) => c.totalSales),
        label: 'Ventas por Cajero',
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ];

    // Tables
    this.topProducts = data.topProducts;
    this.lowStock = data.lowStock;
    this.topCustomers = data.topCustomers;
  }
}
