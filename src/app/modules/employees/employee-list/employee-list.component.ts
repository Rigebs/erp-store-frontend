import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { NotificationUtilService } from '../../../utils/notification-util.service';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { EmployeeService } from '../services/employee.service';
import { EmployeeResponse } from '../models/employee';

@Component({
  selector: 'app-employee-list',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private notificationUtilService: NotificationUtilService
  ) {}

  columns = [
    {
      field: 'person',
      header: 'Nombre',
      valueFn: (row: any) =>
        `${row.person?.name || ''} ${row.person?.paternalName || ''} ${
          row.person?.maternalName || ''
        }`.trim(),
    },
    { field: 'jobTitle', header: 'Cargo' },
    { field: 'salary', header: 'Salario' },
  ];

  employeesData: EmployeeResponse[] = [];
  total: number = 0;

  ngOnInit(): void {
    this.loadEmployees(0, 10);
  }

  loadEmployees(page: number, size: number) {
    this.employeeService.findAll(page, size).subscribe({
      next: (response) => {
        this.employeesData = response.data.content; // sin map
        this.total = response.data.totalElements;
      },
      error: (err) => {
        console.error('Error loading employees: ', err);
      },
    });
  }

  pageChange(event: { items: number; page: number }) {
    this.employeeService.findAll(event.page, event.items).subscribe({
      next: (response) => {
        this.employeesData = response.data.content;
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  createEmployee() {
    this.router.navigateByUrl('management/employees/new');
  }

  onEdit(employee: EmployeeResponse) {
    this.router.navigateByUrl(`management/employees/${employee.id}/edit`);
  }
}
