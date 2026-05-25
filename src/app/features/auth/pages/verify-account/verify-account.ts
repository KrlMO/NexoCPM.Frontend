import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../state/auth-facade';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ConfirmEmailResponse } from '../../models/auth-responses.model';
import { EncodingUtil } from '../../../../shared/utils/encoding.util';
import { Card } from '../../../../shared/ui/card/card';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';

@Component({
  selector: 'app-verify-account',
  imports: [
    Card,
    PrimaryButton,
    SecondaryButton,
    RouterLink
  ],
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.css',
})
export class VerifyAccount {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public email: string = '';
  public isVerifying: boolean = true;
  public verificationSuccess: boolean = false;
  public errorMessage: string = '';

  constructor(
    private authFacadeService: AuthFacade
  ) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');
      const email = params.get('email');

      if (!token || !email) {
        this.isVerifying = false;
        this.verificationSuccess = false;
        this.errorMessage = 'Token o correo electrónico inválido.';
        return;
      }

      this.authFacadeService.confirmEmail(token, email)
        .subscribe((res: ApiResponse<ConfirmEmailResponse>) => {
          this.isVerifying = false;
          if (res.success && res.data?.emailConfirmed) {
            this.email = res.data.email;
            this.verificationSuccess = true;
          } else {
            this.verificationSuccess = false;
            this.errorMessage = res.message || 'Error al verificar la cuenta. Por favor, intenta de nuevo.';
          }
        });
    });
  }

  navigateToLogin() {
    const encodedEmail = EncodingUtil.encodeEmail(this.email);
    this.router.navigate(['/auth/login'], {
      queryParams: { email: encodedEmail, successfullyVerified: true }
    });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
