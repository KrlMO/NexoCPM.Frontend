import { Component, inject } from '@angular/core';
import { Card } from '../../../../shared/ui/card/card';
import { Router, RouterLink } from '@angular/router';
import { MainInput } from '../../../../shared/ui/main-input/main-input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Auth } from '../../services/auth.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ForgotPasswordResponse } from '../../models/auth-responses.model';
import { ForgotPasswordRequest } from '../../models/auth-requests.model';

@Component({
  selector: 'app-forgot-password',
  imports: [
    Card,
    RouterLink,
    MainInput,
    ReactiveFormsModule,
    PrimaryButton
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private authService = inject(Auth);
  private toastService = inject(ToastService);
  private router = inject(Router);

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  get emailControl() { return this.forgotForm.get('email') as FormControl; }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    const data = this.forgotForm.value as ForgotPasswordRequest;
    this.authService.forgotPassword(data).subscribe({
      next: (res: ApiResponse<ForgotPasswordResponse>) => {
        this.toastService.success(res.message || 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.error?.Message || 'Error al enviar el correo. Intenta de nuevo.';
        this.toastService.error(errorMessage);
      }
    });
  }
}
