import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-input',
  imports: [ReactiveFormsModule],
  templateUrl: './main-input.html',
  styleUrl: './main-input.css',
})
export class MainInput {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() control: FormControl = new FormControl('');
}
