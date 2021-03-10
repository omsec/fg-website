import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ApiError } from '../models/api-error';

// handle API errors
// basically convert error codes into readable GUI messages
// https://rollbar.com/blog/error-handling-with-angular-8-tips-and-best-practices/
// https://medium.com/@satyapriyamishra111/angular-error-interceptor-4b102f938065

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor() {}

intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  return next.handle(request)
    .pipe(
      // retry(1), // scheint hier nicht unbedingt sinnvoll, lasse das mal wo passend in den services
      catchError((error: HttpErrorResponse) => {
        let msg = '';

        if (error.error instanceof ErrorEvent) {
          // client side error - ToDo: was ist das eigentlich?
          msg = `Client Error: ${error.error.message}`;
          return throwError(error)
        } else {
          // server side error
          console.log('ERROR INTERCEPTOR: ', error);
          // convert errors to human-redable messages
          // msg = `Server Error Code: ${error.status}\nMessage: ${error.message}`;

          // application errors
          if (error.status === 422) {
            msg = this.formatErrorMessage(error);

            // keep error type to not confuse the auth-error interceptor
            error.error.clientMsg = msg;
            return throwError(error)

          } else {
            // pass any other error
            return throwError(error)
          }
        }
      })
    );
  }

  // ToDo: Wird eventuell doch gestrichen (Aufwand doppelte Texte)
  // und auf dem Server in User-Sprache "lesbar" erzeugt
  formatErrorMessage(error: any): string {
    let msg = '';

    switch ((error.error as ApiError).code) {
      case 10000:
        msg = 'This Forza Share Code is already used' // ToDO: nur ein Test ;-)
        break;
        case 10001:
          msg = 'Programmierfehler (interceptor-msg)'
          break;
      default:
        msg = error.error.msg;
    }
    return msg;
  }

}
