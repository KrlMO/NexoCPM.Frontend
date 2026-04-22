import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponse, RegisterRequest, RegisterResponse } from '../../models/auth.model';
import { API_URL } from '../../config/api.config';

export const REFRESH_TOKEN_COOKIE = 'RefreshToken';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private token: string | null = null;
  private user$ = new BehaviorSubject<any>(null);
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL) + '/v1/auth';

  private withCreds() {
    return { withCredentials: true };
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, this.withCreds()).pipe(
      tap((res: AuthResponse) => {
        this.token = res.accessToken;
        this.user$.next(res.user);
      })
    );
  }

  isLoggedIn$ = this.user$.asObservable();

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user$.asObservable();
  }

  logout() {
    this.token = null;
    this.user$.next(null);
    return this.http.post(`${this.apiUrl}/logout`, {}, this.withCreds());
  }

  register(data: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data, this.withCreds());
  }

  refreshToken() {
    return this.http.post<{ accessToken: string; refreshToken?: string }>(
      `${this.apiUrl}/refresh`,
      {},
      this.withCreds()
    ).pipe(
      tap((res: { accessToken: string; refreshToken?: string }) => {
        this.token = res.accessToken;
      })
    );
  }
}
