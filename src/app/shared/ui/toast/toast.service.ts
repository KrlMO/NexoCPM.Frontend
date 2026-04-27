import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private idCounter = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration = 4000) {
    const id = ++this.idCounter;
    this.toasts.update(t => [...t, { id, message, type }]);

    setTimeout(() => this.dismiss(id), duration);
  }

  error(message: string, duration = 4000) {
    this.show(message, 'error', duration);
  }

  success(message: string, duration = 4000) {
    this.show(message, 'success', duration);
  }

  info(message: string, duration = 4000) {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 4000) {
    this.show(message, 'warning', duration);
  }

  dismiss(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}