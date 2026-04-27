import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { API_URL } from '../../../core/config/api.config';
import { ApiResponse } from '../../../core/models/api-response.model';
import { LoginResponse, RegisterResponse } from '../models/auth-responses.model';
import { RegisterRequest } from '../models/auth-requests.model';

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
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials, this.withCreds()).pipe(
      tap((res: ApiResponse<LoginResponse>) => {
        this.token = res.data?.accessToken || null;
        this.user$.next(res.data?.user);
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
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.apiUrl}/register`, data, this.withCreds());
  }

  refreshToken() {
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
}
