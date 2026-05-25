import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Card } from '../../../../shared/ui/card/card';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../state/auth-facade';
import { EncodingUtil } from '../../../../shared/utils/encoding.util';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { VerifyEmailVerificationResponse } from '../../models/auth-responses.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  imports: [
    Card,
    SecondaryButton,
    PrimaryButton,
    RouterLink
  ],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail implements OnInit, OnDestroy {
  email: string = '';
  maskedEmail: string = '';
  resendIn: number = 0;
  isResendDisabled = true;
  remainingSeconds: number = 0;

  private countdownSubscription: Subscription | null = null;
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

  ngOnDestroy() {
    this.countdownSubscription?.unsubscribe();
  }

  loadStatus() {
    this.authFacadeService.getVerificationStatus(this.email)
      .subscribe((res: ApiResponse<VerifyEmailVerificationResponse>) => {
        if (res.data?.emailVerified) {
          this.router.navigate(['/auth/login'], {
            queryParams: { alreadyVerified: true }
          });
          return;
        }
        if (res.data?.emailExists === false) {
          this.router.navigate(['/auth/login'], {
            queryParams: { emailExists: false }
          });
          return;
        }

        const timeToResend = res.data?.timeToResendSeconds ?? 0;
        this.remainingSeconds = timeToResend;
        this.isResendDisabled = timeToResend > 0;
        this.resendIn = timeToResend;

        this.countdownSubscription?.unsubscribe();

        if (timeToResend > 0) {
          this.countdownSubscription = interval(1000).subscribe(() => {
            if (this.remainingSeconds > 0) {
              this.remainingSeconds--;
              this.resendIn = this.remainingSeconds;

              if (this.remainingSeconds === 0) {
                this.isResendDisabled = false;
                this.countdownSubscription?.unsubscribe();
              }
            }
          });
        }
      });
  }

  resendEmail() {
    if (this.isResendDisabled) return;

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
