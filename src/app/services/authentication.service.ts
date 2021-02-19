import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment'; // zentrale config
import { UserRaw } from '../models/user-raw';
import { User } from '../models/user';
import { UserFactory } from '../models/user-factory';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser$: Observable<User>;

  constructor(private http: HttpClient) {
    // current user wird im local storage gespeichert (falls browser geschlossen wird)
    // https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string
    // entsprechende Abfrage im Guard
    // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    // ToDo: testen, ob besser geeignet -> auch in authentication.guard & header anpassen
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || JSON.stringify(UserFactory.empty())));
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // öffentliches Property für User-Infos
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // Keine Fehlerbehandlung an dieser Stelle notwendig - wird in der Komponente (Login) gemacht
  // ToDO: 2x pipe? - scheinbar nicht nötig so
  /*login(username: string, password: string): Observable<User> {
    return this.http.post<UserRaw>(
      `${environment.apiUrl}/login`, { loginName: username, password: password } )
      .pipe(map(userRaw => UserFactory.fromRaw(userRaw)))
      .pipe(map(user => {
          // client persistence
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
          }
        ),
        catchError(this.errorHandler)
      );
  }*/

  login(username: string, password: string): Observable<User> {
    return this.http.post<UserRaw>(
      `${environment.apiUrl}/login`, { loginName: username, password: password } )
        .pipe(
          map(userRaw => UserFactory.fromRaw(userRaw)),
          map(user => {
            // client persistence
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
            }),
          catchError(this.errorHandler)
        )
  }

  // Error Handling zur Sicherheit, falls der Zustand inkonsistent wird (Cookie weg, Current User noch im local storage)
  logout(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/logout`, { responseType: 'text'})
        // kein resultat von diesem service, aber rückkehr abwarten
        .pipe(
          map(() => {
            localStorage.removeItem('currentUser');
            this.currentUserSubject.next(UserFactory.empty());}
          ),
          catchError(this.errorHandlerLogOut)
        );
  }

  // ToDO: Error Handling: log-out & set empty User => logout, errorHandler/LogOut-Handler
  refreshToken(): Observable<User> {
    return this.http.post<UserRaw>(
      `${environment.apiUrl}/refresh`, null)
      .pipe(map(userRaw => UserFactory.fromRaw(userRaw)))
      .pipe(map(user => {
        // client persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
    }));
  }

  // let user re-type their passwords in case of increased security needs
  verifyPassword(password: string): Observable<boolean> {
    return this.http.post<any>(
      `${environment.apiUrl}/user/verifyPass`, { loginName: this.currentUserValue.loginName, password })
        .pipe(map(response => response.granted));
  }

  changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
    return this.http.post<any>(
      `${environment.apiUrl}/user/changePass`, { loginName: this.currentUserValue.loginName, currentPWD: oldPassword, newPWD: newPassword })
        .pipe(
          map(() => true), // hack? ;-) just return obs-true, if everything went right, since the service doesn't return data (status only)
          catchError(err => {return throwError('Please try again later') }));
  }

  // may return { id: string } or { api-error (ToDo) }
  // no additional error handliong required - taken care of by http-error interceptor
  register(user: User): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/register`, user).pipe(
        map(id => {}), // ToDo: eigentlich unnötig, aber ohne geht's nicht
        catchError(this.errorHandler)
      );
  }

  // used for validation of new accounts
  existsUserName(userName: string): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/user/exists`, { loginName: userName })
    .pipe(map(response => response.exists === true))
  }

  // used for validation of new accounts
  existsEMailAddress(eMailAddress: string): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/email/exists`, { eMailAddress })
    .pipe(map(response => response.exists === true))
  }

  // ToDo: in logOut integrieren
  private errorHandlerLogOut(error: HttpErrorResponse): Observable<any> {
    localStorage.removeItem('currentUser');
    // this.currentUserSubject.next(UserFactory.empty()) // nicht nötig, schon closed (error)
    return throwError(error)
  }

  // Für lokale Fehrlebehandlung (interceptors sind global)
  // hier kann eine benutzerfeundliche Meldung der Fehler-Codes erzeugt werden, Logging etc.
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    console.log('SERVICE: ', error);
    console.log(error.status);
    if (error.status) {
      // server errors
      switch (error.status) {
        case 422: return throwError(error.error.clientMsg);
        case 401 || 403: return throwError('invalid user name or password');
        default: return throwError('something went wrong');
      }
    } else {
      // Programmierfehler
      return throwError('something went wrong');
    }
  }


}
