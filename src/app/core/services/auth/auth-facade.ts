import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from '../../config/api.config';
import { VerifyEmailVerificationResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private apiUrl = inject(API_URL) + '/v1/auth';

  private emailSubject = new BehaviorSubject<string | null>(null);
  email$ = this.emailSubject.asObservable();

  constructor(private http: HttpClient) { }

  setEmail(email: string) {
    this.emailSubject.next(email);
  }

  getEmail() {
    return this.emailSubject.value;
  }

  getVerificationStatus(email: string) {
    return this.http.get<VerifyEmailVerificationResponse>(`${this.apiUrl}/verify/status`, {
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
}
