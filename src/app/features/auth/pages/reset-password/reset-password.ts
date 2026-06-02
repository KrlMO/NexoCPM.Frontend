import { Component, inject, OnInit } from '@angular/core';
import { Card } from '../../../../shared/ui/card/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MainInput } from '../../../../shared/ui/main-input/main-input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Auth } from '../../services/auth.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ResetPasswordResponse } from '../../models/auth-responses.model';
import { ResetPasswordRequest } from '../../models/auth-requests.model';

@Component({
  selector: 'app-reset-password',
  imports: [
    Card,
    RouterLink,
    MainInput,
    ReactiveFormsModule,
    PrimaryButton
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private authService = inject(Auth);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  email = '';

  resetForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  get newPasswordControl() { return this.resetForm.get('newPassword') as FormControl; }
  get confirmPasswordControl() { return this.resetForm.get('confirmPassword') as FormControl; }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token') || '';
      this.email = params.get('email') || '';

      if (!this.token || !this.email) {
        this.toastService.error('Enlace inválido o expirado.');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const password = this.resetForm.value.newPassword;
    const confirm = this.resetForm.value.confirmPassword;

    if (password !== confirm) {
      this.toastService.error('Las contraseñas no coinciden.');
      return;
    }

    const data: ResetPasswordRequest = {
      email: this.email,
      token: this.token,
      newPassword: password!
    };

    this.authService.resetPassword(data).subscribe({
      next: (res: ApiResponse<ResetPasswordResponse>) => {
        this.toastService.success(res.message || 'Contraseña restablecida exitosamente.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.error?.Message || 'Error al restablecer la contraseña. Intenta de nuevo.';
        this.toastService.error(errorMessage);
      }
    });
  }
}
