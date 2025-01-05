import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from '../service/local-storage.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getVariable('token');

  let modifiedRequest = req;

  if (token) {
    modifiedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(modifiedRequest).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        let newToken: string | undefined;
        if (event.body?.token) {
          newToken = event.body.token;
        } else if (event.body?.editUser?.token) {
          newToken = event.body.editUser.token;
        }

        if (newToken) {
          localStorageService.setVariable('token', newToken);
        }
      }
    })
  );
};
