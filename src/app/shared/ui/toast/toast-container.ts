import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[400px] animate-slide-in"
             [class]="getToastClasses(toast.type)">
          <span class="flex-shrink-0">{{ getIcon(toast.type) }}</span>
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          <button (click)="toastService.dismiss(toast.id)"
                  class="flex-shrink-0 hover:opacity-70 transition-opacity text-lg leading-none">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in { animation: slide-in 0.3s ease-out; }
  `]
})
export class ToastContainer {
  toastService = inject(ToastService);

  getToastClasses(type: ToastType): string {
    const baseClasses = 'border';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-50 border-blue-500 text-blue-800`;
    }
  }

  getIcon(type: ToastType): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
    }
  }
}