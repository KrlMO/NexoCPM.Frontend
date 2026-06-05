import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  imports: [],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.css',
})
export class PrimaryButton {
  @Output() clicked = new EventEmitter<void>();
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'pink' = 'primary';
  onClick() {
    this.clicked.emit();
  }

  get classes(): string {
    const base = 'rounded-lg px-4 md:px-8 py-2 md:py-2.5 border focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all text-center leading-tight text-xs md:text-sm';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-blue-500',
      secondary: 'bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-400',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
      pink: 'bg-primary-pink text-white hover:bg-primary-pink-dark focus:ring-primary-pink'
    };

    return `${base} ${variants[this.variant]}`;
  }
}

