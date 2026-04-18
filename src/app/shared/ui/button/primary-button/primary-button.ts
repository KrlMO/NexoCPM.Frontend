import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  imports: [],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.css',
})
export class PrimaryButton {
  @Input() label: string = '';
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
}
