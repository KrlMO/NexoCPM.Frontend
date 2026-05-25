import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-general-modal',
  imports: [],
  templateUrl: './general-modal.html',
  styleUrl: './general-modal.css',
})
export class GeneralModal {
  @Input() containerClass = 'max-w-md sm:max-w-lg';

  @Output() cancel = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    this.cancel.emit();
  }
}
