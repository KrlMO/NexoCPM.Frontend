import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth/auth';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const token = auth.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401 && !req.url.includes('/refresh') && !isRefreshing) {
        isRefreshing = true;

        return auth.refreshToken().pipe(
          switchMap(res => {
            const newToken = (res as { accessToken: string }).accessToken;
            isRefreshing = false;
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            isRefreshing = false;
            auth.logout().subscribe(() => {
              router.navigate(['/auth/login']);
            });
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
