import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LocalStorageService } from '../service/local-storage.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const localService = inject(LocalStorageService);

  const token = localService.getVariable('token');
  if (token) {

    return true;
 
  } else {
    router.navigate(['/login'], { queryParams: { error: 'Acceso Denegado' } });
    return false;
  }
};
