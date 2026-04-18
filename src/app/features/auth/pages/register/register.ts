import { Component } from '@angular/core';
import { Card } from "../../../../shared/ui/card/card";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MainInput } from '../../../../shared/ui/main-input/main-input';
import { RouterLink } from '@angular/router';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [
    Card,
    MainInput,
    RouterLink,
    PrimaryButton
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm = new FormGroup(
    {
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      userName: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl('')
    },
    { validators: passwordMatchValidator });

  get firstNameControl() { return this.registerForm.get('firstName') as FormControl; }
  get lastNameControl() { return this.registerForm.get('lastName') as FormControl; }
  get userNameControl() { return this.registerForm.get('userName') as FormControl; }
  get emailControl() { return this.registerForm.get('email') as FormControl; }
  get passwordControl() { return this.registerForm.get('password') as FormControl; }
  get confirmPasswordControl() { return this.registerForm.get('confirmPassword') as FormControl; }

  get passwordMismatch() {
    return this.registerForm.hasError('passwordMismatch') && this.confirmPasswordControl.touched;
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    console.log(this.registerForm.value);
  }
}
