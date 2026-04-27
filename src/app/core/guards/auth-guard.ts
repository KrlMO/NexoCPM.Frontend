import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../features/auth/services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.getToken()) {
    return true;
  }

  return auth.refreshToken().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/auth/login'])))
  );
};