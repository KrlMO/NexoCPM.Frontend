import { Component, inject } from '@angular/core';
import { AuthLayout } from "../../../../layout/auth-layout/auth-layout";
import { Card } from '../../../../shared/ui/card/card';
import { RouterLink } from '@angular/router';
import { MainInput } from '../../../../shared/ui/main-input/main-input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { LoginRequest } from '../../../../core/models/auth.model';
import { Auth } from '../../../../core/services/auth/auth';

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

export class Login {
  private authService = inject(Auth);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  get emailControl() { return this.loginForm.get('email') as FormControl; }
  get passwordControl() { return this.loginForm.get('password') as FormControl; }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm.invalid) return;
    const data = this.loginForm.value as LoginRequest;
    this.authService.login(data).subscribe();
  }
}
