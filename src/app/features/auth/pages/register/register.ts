import { Component, inject } from '@angular/core';
import { Card } from "../../../../shared/ui/card/card";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MainInput } from '../../../../shared/ui/main-input/main-input';
import { Router, RouterLink } from '@angular/router';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Auth } from '../../../../core/services/auth/auth';
import { RegisterRequest, RegisterResponse } from '../../../../core/models/auth.model';
import { EncodingUtil } from '../../../../shared/utils/encoding.util';

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
  private authService = inject(Auth);
  private router = inject(Router);

  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
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

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.registerForm.invalid) return;

    const data = this.registerForm.value as RegisterRequest;

    this.authService.register(data).subscribe({
      next: (res: RegisterResponse) => {

        const encodedEmail = EncodingUtil.encodeEmail(res.email);

        this.router.navigate(['/auth/verify-email'], {
          queryParams: {
            email: encodedEmail
          }
        });
      }
    });
  }
}
