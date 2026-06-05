import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.html',
  styleUrl: './secondary-button.css',
})
export class SecondaryButton {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() variant: 'primary' | 'danger' | 'pink' = 'primary';

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  get classes(): string {
    const base =
      'rounded-lg px-4 md:px-8 py-2 md:py-2.5 border focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all bg-white text-center leading-tight text-xs md:text-sm';

    const variants = {
      primary:
        'text-primary border-primary hover:bg-primary hover:text-white focus:ring-blue-500',
      danger:
        'text-red-500 border-red-500 hover:bg-red-500 hover:text-white focus:ring-red-400',
      pink:
        'text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white focus:ring-pink-400',
    };

    return `${base} ${variants[this.variant]}`;
  }
}