import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError  } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, filter, take, switchMap, first } from 'rxjs/operators';

import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { UserFactory } from '../models/user-factory';


@Injectable()
export class AuthenticationErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false; // current status
  // status indicator (used as a wait flag)
  private refreshTokenSubject: BehaviorSubject<User> = new BehaviorSubject<User>(UserFactory.empty());

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) {}

  // https://angular-academy.com/angular-jwt/

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      //const error = err.error.message || err.statusText; // Kurztext gemäss HTTP-Response Code (z. B. "forbidden")
      // const error = err.error // error msg for use in GUI

      // do not refresh auth routes
      if (request.url.includes('login') || request.url.includes('refresh') /*|| request.url.includes('register')*/) {
        // check for already failed refresh
        if (request.url.includes('refresh')) {
          this.authenticationService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(err);
      }

      // handle unknown other error
      if (err instanceof HttpErrorResponse && err.status !== 401) {
        return throwError(err);
      }

      // let the server refresh httpOnly-Cookie
      return this.handleRefresh(request, next);
    }));
  }

  handleRefresh(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      // wait for current request to complete
      return this.refreshTokenSubject.pipe(
        filter(user => user.id !== ''),
        take(1),
        switchMap(() => {
          return next.handle(request);
        }));
    } else {
      // have subsequent API calls wait until refresh is done
      this.isRefreshing = true;
      this.refreshTokenSubject.next(UserFactory.empty());
      // console.log('REFRESHED');

      return this.authenticationService.refreshToken().pipe(
        switchMap((user: User) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(user);
          return next.handle(request);
        }));
    }
  }

}
