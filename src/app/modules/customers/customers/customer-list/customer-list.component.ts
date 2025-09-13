import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CustomerService } from '../../services/customer.service';
import { CustomerResponse } from '../../models/customer';
import { NotificationUtilService } from '../../../../utils/notification-util.service';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-customer-list',
  imports: [DynamicTableComponent, MatButtonModule, MatIconModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
})
export class CustomerListComponent {
  constructor(
    private router: Router,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private notificationUtilService: NotificationUtilService
  ) {}

  columns = [
    { field: 'displayName', header: 'Nombre' },
    { field: 'displayEmail', header: 'Email' },
    { field: 'displayPhone', header: 'Teléfono' },
    { field: 'enabled', header: 'Estado' },
  ];

  customersData: CustomerResponse[] = [];
  total: number = 0;

  ngOnInit(): void {
    this.loadCustomers(0, 10);
  }

  loadCustomers(page: number, size: number) {
    this.customerService.findAll(page, size).subscribe({
      next: (response) => {
        this.customersData = response.data.content.map((c) => ({
          ...c,
          displayName: c.person
            ? `${c.person.name} ${c.person.paternalName || ''} ${
                c.person.maternalName || ''
              }`.trim()
            : c.company?.name,
          displayEmail: c.person?.email || c.company?.email,
          displayPhone: c.person?.phone || c.company?.phone,
        }));
        this.total = response.data.totalElements;
      },
      error: (err) => {
        console.error('Error loading customers: ', err);
      },
    });
  }

  pageChange(event: { items: number; page: number }) {
    this.customerService.findAll(event.page, event.items).subscribe({
      next: (response) => {
        this.customersData = response.data.content;
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  createCustomer() {
    this.router.navigateByUrl('management/customers/new');
  }

  onEdit(customer: CustomerResponse) {
    this.router.navigateByUrl(`management/customers/${customer.id}/edit`);
  }

  onToggleEnabled(customer: CustomerResponse) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmación',
        message: `¿Estás seguro de ${
          customer.enabled ? 'desactivar' : 'activar'
        } el cliente con ID ${customer.id}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.customerService.toggleEnabled(customer.id).subscribe({
          next: (response) => {
            this.notificationUtilService.showMessage(response.message);
            const customerToUpdate = this.customersData.find(
              (c) => c.id === customer.id
            );
            if (customerToUpdate) {
              customerToUpdate.enabled = !customerToUpdate.enabled;
            }
          },
          error: (err) => {
            console.error('Error toggling status: ', err);
          },
        });
      }
    });
  }
}
