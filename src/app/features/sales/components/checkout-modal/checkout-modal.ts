import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal-service';
import { ModalContainer } from '../../../../shared/ui/modal-container/modal-container';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, ModalContainer, CurrencyPipe],
  templateUrl: './checkout-modal.html',
  styleUrl: './checkout-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutModal {
  private modalService = inject(ModalService);

  total = input.required<number>();
  customer = input.required<any>();

  paymentMethods = signal({ cash: 0, card: 0, transfer: 0 });
  cashReceived = signal(0);
  documentType = signal('TICKET');

  quickAmounts = [10, 20, 50, 100, 200];

  pendingAmount = computed(() => {
    const { cash, card, transfer } = this.paymentMethods();
    const balance = this.total() - (cash + card + transfer);
    return Math.max(0, +balance.toFixed(2));
  });

  changeToReturn = computed(() => {
    const paidWithCash = this.paymentMethods().cash;
    const received = this.cashReceived();
    return received > paidWithCash ? +(received - paidWithCash).toFixed(2) : 0;
  });

  addQuickAmount(amount: number) {
    this.cashReceived.update((v) => v + amount);
  }

  selectOnly(method: 'cash' | 'card' | 'transfer') {
    this.paymentMethods.set({ cash: 0, card: 0, transfer: 0 });
    this.paymentMethods.update((prev) => ({ ...prev, [method]: this.total() }));
    if (method === 'cash') this.cashReceived.set(this.total());
  }

  updatePayment(method: 'cash' | 'card' | 'transfer', val: any) {
    const num = +val || 0;
    this.paymentMethods.update((prev) => ({ ...prev, [method]: num }));
  }

  resetPayments() {
    this.paymentMethods.set({ cash: 0, card: 0, transfer: 0 });
    this.cashReceived.set(0);
  }

  onClose() {
    this.modalService.close();
  }

  confirm(action: 'PAID' | 'CREDIT' | 'PENDING') {
    const methods = this.paymentMethods();
    const paymentsArray = [];

    if (methods.cash > 0) paymentsArray.push({ method: 'CASH', amount: methods.cash });
    if (methods.card > 0) paymentsArray.push({ method: 'CARD', amount: methods.card });
    if (methods.transfer > 0) paymentsArray.push({ method: 'TRANSFER', amount: methods.transfer });

    this.modalService.close({
      status: action,
      documentType: this.documentType(),
      payments: paymentsArray,
      total: this.total(),
      change: this.changeToReturn(),
    });
  }
}
