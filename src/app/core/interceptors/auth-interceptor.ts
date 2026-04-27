import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../../features/auth/services/auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const token = auth.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  const ignoredUrls = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/verify-email/status'];

  return next(authReq).pipe(
    catchError(err => {
      if (
        err.status === 401 &&
        !ignoredUrls.some(url => req.url.includes(url)) &&
        !isRefreshing
      ) {
        isRefreshing = true;

        return auth.refreshToken().pipe(
          switchMap(res => {
            const newToken = res.data?.accessToken;
            isRefreshing = false;
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            isRefreshing = false;
            auth.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
