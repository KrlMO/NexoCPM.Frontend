import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea-input',
  imports: [ReactiveFormsModule],
  templateUrl: './textarea-input.html',
  styleUrl: './textarea-input.css',
})
export class TextareaInput {
  @Input() placeholder = '';
  @Input() label = '';
  @Input() control: FormControl = new FormControl('');
  @Input() rows = 4;
}
