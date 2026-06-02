import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ChangePasswordResponse, ForgotPasswordResponse, LoginResponse, RegisterResponse, ResetPasswordResponse } from '../models/auth-responses.model';
import { ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest } from '../models/auth-requests.model';
import { Router } from '@angular/router';

export const REFRESH_TOKEN_COOKIE = 'RefreshToken';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private token: string | null = null;
  private user$ = new BehaviorSubject<any>(null);
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL) + '/v1/auth';
  private router = inject(Router);

  private withCreds() {
    return { withCredentials: true };
  }

  public login(credentials: LoginRequest) {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials, this.withCreds()).pipe(
      tap((res: ApiResponse<LoginResponse>) => {
        this.token = res.data?.accessToken || null;
        this.user$.next(res.data?.user);
      })
    );
  }

  isLoggedIn$ = this.user$.asObservable();

  public getToken() {
    return this.token;
  }

  public getUser() {
    return this.user$.asObservable();
  }

  public logout() {
    this.token = null;
    this.user$.next(null);
    this.router.navigate(['/auth/login']);
    return this.http.post(`${this.apiUrl}/logout`, {}, this.withCreds());
  }

  public register(data: RegisterRequest) {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.apiUrl}/register`, data, this.withCreds());
  }

  public refreshToken() {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/refresh`,
      {},
      this.withCreds()
    ).pipe(
      tap((res: ApiResponse<LoginResponse>) => {
        this.token = res.data?.accessToken || null;
        this.user$.next(res.data?.user || null);
      })
    );
  }

  initAuth() {
    return this.refreshToken().pipe(
      tap(() => console.log('Sesión restaurada')),
      catchError(() => {
        this.token = null;
        this.user$.next(null);
        return of(null);
      })
    );
  }

  isAuthenticated() {
    return !!this.token;
  }

  public forgotPassword(data: ForgotPasswordRequest) {
    return this.http.post<ApiResponse<ForgotPasswordResponse>>(`${this.apiUrl}/forgot-password`, data);
  }

  public resetPassword(data: ResetPasswordRequest) {
    return this.http.post<ApiResponse<ResetPasswordResponse>>(`${this.apiUrl}/reset-password`, data, this.withCreds());
  }


}
