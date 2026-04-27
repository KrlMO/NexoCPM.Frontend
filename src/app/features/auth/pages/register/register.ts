import { Component, inject } from '@angular/core';
import { Card } from "../../../../shared/ui/card/card";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MainInput } from '../../../../shared/ui/main-input/main-input';
import { Router, RouterLink } from '@angular/router';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Auth } from '../../services/auth.service';
import { EncodingUtil } from '../../../../shared/utils/encoding.util';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterRequest } from '../../models/auth-requests.model';
import { RegisterResponse } from '../../models/auth-responses.model';

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
    PrimaryButton,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService);

  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
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

  isLoading = false;

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const data = this.registerForm.value as RegisterRequest;

    this.isLoading = true;
    this.authService.register(data).subscribe({
      next: (res: ApiResponse<RegisterResponse>) => {
        this.isLoading = false;
        if (res.success) {
          const encodedEmail = EncodingUtil.encodeEmail(res.data?.email || '');
          this.router.navigate(['/auth/verify-email'], {
            queryParams: { email: encodedEmail }
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || err.error?.Message || 'Error al registrar. Por favor intenta de nuevo.';
        this.toastService.error(errorMessage);
      }
    });
  }

  private markAllAsTouched() {
    this.registerForm.markAllAsTouched();
  }
}