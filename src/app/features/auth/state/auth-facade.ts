import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ConfirmEmailResponse, VerifyEmailVerificationResponse } from '../models/auth-responses.model';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private apiUrl = inject(API_URL) + '/v1/auth';

  private emailSubject = new BehaviorSubject<string | null>(null);
  email$ = this.emailSubject.asObservable();

  private withCreds() {
    return { withCredentials: true };
  }
  
  constructor(private http: HttpClient) { }

  setEmail(email: string) {
    this.emailSubject.next(email);
  }

  getEmail() {
    return this.emailSubject.value;
  }

  getVerificationStatus(email: string) {
    return this.http.get<ApiResponse<VerifyEmailVerificationResponse>>(`${this.apiUrl}/verify-email/status`, {
      params: { email }
    });
  }

  resendVerification(email: string) {
    return this.http.post(`${this.apiUrl}/verify/resend`, { email });
  }

  encodeEmail(email: string): string {
    return btoa(email);
  }

  decodeEmail(email: string): string {
    return atob(email);
  }

  public confirmEmail(token: string, email: string) {
    return this.http.post<ApiResponse<ConfirmEmailResponse>>(`${this.apiUrl}/verify-email/confirm`, { token, email }, this.withCreds());
  }
}
