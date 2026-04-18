import { Component, inject } from '@angular/core';
import { Card } from '../../../../shared/ui/card/card';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from '../../../../core/services/auth/auth-facade';
import { EncodingUtil } from '../../../../shared/utils/encoding.util';
import { VerifyEmailVerificationResponse } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-verify-email',
  imports: [
    Card,
    SecondaryButton,
    PrimaryButton
  ],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  email: string = '';
  maskedEmail: string = '';
  resendIn: number = 0;

  private router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private authFacadeService: AuthFacade
  ) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const encoded = params.get('email');

      if (encoded) {
        const email = EncodingUtil.decodeEmail(encoded);

        this.authFacadeService.setEmail(email);

        this.email = email;
        this.maskedEmail = EncodingUtil.maskEmail(email);

        this.loadStatus();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  loadStatus() {
    this.authFacadeService.getVerificationStatus(this.email)
      .subscribe((res: VerifyEmailVerificationResponse) => {
        if (res.alreadyVerified) {
          this.router.navigate(['/auth/login'], {
            queryParams: { alreadyVerified: true }
          });
          return;
        }
        if (res.emailDoesNotExist) {
          this.router.navigate(['/auth/login'], {
            queryParams: { emailExists: false }
          });
          return;
        }
        this.resendIn = res.nextResendIn;
      });
  }

  resendEmail() {
    this.authFacadeService.resendVerification(this.email)
      .subscribe(() => {
        this.loadStatus();
      });
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
