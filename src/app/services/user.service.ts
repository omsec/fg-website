import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, map, delay, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { UserRaw } from '../models/user-raw';
import { User } from '../models/user';
import { UserFactory } from '../models/user-factory';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // view profile
  /*getSingle(userId: string): Observable<User> {
    return this.http.get<UserRaw>(
      `${environment.apiUrl}/users/${userId}`)
        .pipe(
          retry(1),
          // delay(5000), // test loading msg in component
          map(userRaw => UserFactory.fromRaw(userRaw)),
          catchError(this.errorHandler)
        );
  }*/

  // view profile
  getSingle(userId: string): Observable<User> {
    return this.http.get<UserRaw>(
      `${environment.apiUrl}/users/${userId}`)
        .pipe(
          retry(1),
          // delay(1000), // test loading msg in component
          map(userRaw => UserFactory.fromRaw(userRaw)),
          catchError(this.errorHandler)
        );
  }

  // error Testing
  getTest(userId: string): Observable<User> {
    return this.http.get<UserRaw>(
      `${environment.apiUrl}/test`)
        .pipe(
          retry(1),
          delay(1000), // test loading msg in component
          map(userRaw => UserFactory.fromRaw(userRaw)),
          catchError(this.errorHandler)
        );

  }

  // Für lokale Fehrlebehandlung (interceptors sind global)
  // hier kann eine benutzerfeundliche Meldung der Fehler-Codes erzeugt werden, Logging etc.
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    console.log('SERVICE: ', error);
    // console.log(error.status);
    if (error.status) {
      // server errors
      if (error.status === 422) {
        return throwError(error.error.clientMsg);
      } else {
        return throwError('something went wrong');
      }
    } else {
      // client errors (programmierfehler, api time-out...)
      // console.log(error);
      return throwError('something went wrong');
    }
  }

}
