import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);

  toasts = this.toastsSignal.asReadonly();

  show(type: ToastType, title: string, message: string, duration = 5000) {
    const id = Date.now();
    const newToast: Toast = { id, type, title, message, duration };

    this.toastsSignal.update((all) => [...all, newToast]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  remove(id: number) {
    this.toastsSignal.update((all) => all.filter((t) => t.id !== id));
  }

  success(title: string, message: string) {
    this.show('success', title, message);
  }
  error(title: string, message: string) {
    this.show('error', title, message);
  }
  warning(title: string, message: string) {
    this.show('warning', title, message);
  }
  info(title: string, message: string) {
    this.show('info', title, message);
  }
}
