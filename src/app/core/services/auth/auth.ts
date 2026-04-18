import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponse, RegisterRequest, RegisterResponse } from '../../models/auth.model';
import { API_URL } from '../../config/api.config';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private token: string | null = null;
  private user$ = new BehaviorSubject<any>(null);
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL) + '/v1/auth';

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        this.token = res.accessToken;
        this.user$.next(res.user);
      })
    );
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user$.asObservable();
  }

  logout() {
    this.token = null;
    this.user$.next(null);
    return this.http.post('/api/auth/logout', {});
  }

  register(data: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  refreshToken() {
    return this.http.post<any>('/api/auth/refresh', {}).pipe(
      tap(res => {
        this.token = res.accessToken;
      })
    );
  }
}
