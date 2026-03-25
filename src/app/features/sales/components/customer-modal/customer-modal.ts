import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal-service';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer-service';

@Component({
  selector: 'app-customer-modal',
  imports: [ModalContainer, ReactiveFormsModule],
  templateUrl: './customer-modal.html',
  styleUrl: './customer-modal.css',
})
export class CustomerModal implements OnInit {
  private modalService = inject(ModalService);
  private customerService = inject(CustomerService);
  private fb = inject(NonNullableFormBuilder);

  isCreatingCustomer = signal(false);
  searchQuery = signal('');

  customers = computed(() =>
    this.customerService.customers().map((c) => {
      const name = c.person?.name || c.company?.name || 'S/N';
      return {
        ...c,
        displayName: name,
        initials: name.substring(0, 2).toUpperCase(),
      };
    }),
  );

  customerForm = this.fb.group({
    identifier: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    phone: [''],
  });

  ngOnInit() {
    this.loadCustomers();

    effect(
      () => {
        const query = this.searchQuery();
        untracked(() => this.loadCustomers(query));
      },
      { allowSignalWrites: true },
    );
  }

  loadCustomers(query: string = '') {
    this.customerService.findAll({ query, enabled: true }, 0, 10).subscribe();
  }

  toggleCreateCustomer() {
    this.isCreatingCustomer.update((v) => !v);
    if (!this.isCreatingCustomer()) this.customerForm.reset();
  }

  selectCustomer(customer: any) {
    const name =
      customer.displayName || customer.person?.name || customer.company?.name || 'Cliente';

    const identifier =
      customer.identifier || customer.person?.phone || customer.company?.phone || '00000000';

    const initials = customer.initials || name.substring(0, 2).toUpperCase();

    this.modalService.close({
      id: customer.id,
      name: name,
      identifier: identifier,
      initials: initials,
    });
  }

  close() {
    this.modalService.close();
  }

  saveNewCustomer() {
    if (this.customerForm.invalid) return;
    const { identifier, name, phone } = this.customerForm.getRawValue();

    const isCompany = identifier.length === 11;

    const payload = {
      enabled: true,
      [isCompany ? 'company' : 'person']: {
        name: name,
        phone: phone,
        identifier: identifier,
      },
    };

    this.customerService.save(payload).subscribe({
      next: (savedCustomer) => {
        this.selectCustomer(savedCustomer);
      },
      error: (err) => {
        console.error('Error al guardar cliente', err);
      },
    });
  }
}
