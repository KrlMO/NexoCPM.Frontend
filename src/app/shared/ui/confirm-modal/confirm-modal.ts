import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { PrimaryButton } from '../button/primary-button/primary-button';
import { SecondaryButton } from '../button/secondary-button/secondary-button';

@Component({
  selector: 'app-confirm-modal',
  imports: [PrimaryButton, SecondaryButton],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {
  @Input() title = 'Confirmar';
  @Input() message = '¿Estás seguro?';
  @Input() confirmLabel = 'Aceptar';
  @Input() cancelLabel = 'Cancelar';
  @Input() secondaryLabel: string | undefined = undefined;
  @Input() confirmVariant: 'primary' | 'danger' | 'pink' = 'primary';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() secondary = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    this.cancel.emit();
  }
}
