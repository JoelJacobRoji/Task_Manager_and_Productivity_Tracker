import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.error?.message ||
        `Request to ${req.url} failed with status ${error.status || 'unknown'}.`;

      console.error('[HTTP Error]', message);
      return throwError(() => new Error(message));
    })
  );
};
