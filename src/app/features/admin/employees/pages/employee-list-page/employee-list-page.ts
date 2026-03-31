import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { EmployeeService } from '../../services/employee-service';
import { Router } from '@angular/router';
import { CreateUserModal } from '../../components/create-user-modal/create-user-modal';
import { ModalService } from '../../../../../shared/services/modal-service';
import { Employee } from '../../../../../core/models/user.model';

@Component({
  selector: 'app-employee-list-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-list-page.html',
  styleUrl: './employee-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block p-8',
  },
})
export class EmployeeListPage {
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);

  searchControl = new FormControl('', { nonNullable: true });
  searchTerm = signal('');

  employees = this.employeeService.employees;
  isLoading = this.employeeService.isLoading;
  totalElements = this.employeeService.totalElements;

  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const all = this.employees();

    if (!term) return all;

    return all.filter((emp) => {
      const fullName =
        `${emp.person.name} ${emp.person.paternalName} ${emp.person.maternalName}`.toLowerCase();
      const email = emp.person.email.toLowerCase();
      const job = emp.jobTitle.toLowerCase();

      const role = emp.user?.role?.toLowerCase() || '';

      return (
        fullName.includes(term) || email.includes(term) || job.includes(term) || role.includes(term)
      );
    });
  });

  constructor() {
    this.employeeService.findAll().subscribe();

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.searchTerm.set(value));
  }

  deleteEmployee(id: number): void {
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar este registro? Se perderá el acceso del usuario asociado.',
      )
    ) {
      this.employeeService.delete(id).subscribe();
    }
  }

  createUser(emp: Employee): void {
    this.modalService.open(CreateUserModal, { employee: emp }).subscribe((result) => {
      if (result) {
        console.log(result);

        this.employeeService.createAccount(emp.id, result).subscribe();
      }
    });
  }

  goToForm(id?: number): void {
    const path = id ? ['/admin/users/employees/edit', id] : ['/admin/users/employees/new'];
    this.router.navigate(path);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      TERMINATED: 'Cesado',
      ON_LEAVE: 'Licencia',
    };
    return labels[status] || status;
  }
}
