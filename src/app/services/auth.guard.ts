import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, take, tap } from 'rxjs';

const isAuthenticated = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isAuth().pipe(
    tap((estado) => {
      if (!estado) {
        router.navigate(['/login']);
      }
    }),
    take(1)
  );
};

export const canActivate: CanActivateFn = isAuthenticated;
export const canMatch: CanMatchFn = isAuthenticated;
