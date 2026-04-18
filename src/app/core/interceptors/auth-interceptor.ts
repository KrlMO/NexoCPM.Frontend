import { HttpHandler, HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  const token = auth.getToken();

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        return auth.refreshToken().pipe(
          switchMap(() => {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${auth.getToken()}`
              }
            });
            return next(newReq);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
