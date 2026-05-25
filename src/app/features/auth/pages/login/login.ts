import { Component, inject, OnInit } from '@angular/core';
import { AuthLayout } from "../../../../layout/auth-layout/auth-layout";
import { Card } from '../../../../shared/ui/card/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MainInput } from '../../../../shared/ui/main-input/main-input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { Auth } from '../../services/auth.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { LoginResponse } from '../../models/auth-responses.model';
import { LoginRequest } from '../../models/auth-requests.model';
import { EncodingUtil } from '../../../../shared/utils/encoding.util';

@Component({
  selector: 'app-login',
  imports: [
    Card,
    RouterLink,
    MainInput,
    ReactiveFormsModule,
    PrimaryButton
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login implements OnInit {
  private authService = inject(Auth);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('alreadyVerified') === 'true') {
        this.toastService.warning('Tu correo ya ha sido verificado. Por favor, inicia sesión.');
      }
      if (params.get('emailExists') === 'false') {
        this.toastService.warning('El correo electrónico no está registrado. Por favor, regístrate primero.');
      }
      if (params.get('successfullyVerified') === 'true') {
        this.toastService.success('Cuenta verificada exitosamente. Por favor, inicia sesión.');
      }

      const email = params.get('email');
      if (email) {
        const decodedEmail = EncodingUtil.decodeEmail(email);
        this.loginForm.patchValue({ email: decodedEmail });
      }
    });
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get emailControl() { return this.loginForm.get('email') as FormControl; }
  get passwordControl() { return this.loginForm.get('password') as FormControl; }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const data = this.loginForm.value as LoginRequest;
    this.authService.login(data).subscribe({
      next: (res: ApiResponse<LoginResponse>) => {
        this.toastService.success('Bienvenido ' + res.data?.user.firstName);
        this.router.navigate(['/app/home']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.error?.Message || 'Credenciales incorrectas. Por favor intenta de nuevo.';
        this.toastService.error(errorMessage);
      }
    });
  }
}
