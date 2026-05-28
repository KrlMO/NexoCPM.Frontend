import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-star',
  standalone: true,
  imports: [],
  template: `
    <svg
      [class]="classes()"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      line-height: 0;
    }
  `]
})
export class Star {
  filled = input<boolean>(true);
  sizeClass = input<string>('w-5 h-5');
  filledColorClass = input<string>('text-yellow-400');
  emptyColorClass = input<string>('text-gray-300');

  classes = computed(() => {
    const size = this.sizeClass();
    const color = this.filled() ? this.filledColorClass() : this.emptyColorClass();
    return `${size} ${color}`;
  });
}
