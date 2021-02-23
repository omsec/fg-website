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
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || JSON.stringify(UserFactory.empty())));
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // öffentliches Property für User-Infos
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

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

  // Eigenes Error Handling damit das Menu aktualisiert wird (header component)
  // falls der Zustand inkonsistent wird (Cookie/Tokens weg, Current User noch im local storage)
  logout(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/logout`, { responseType: 'text'})
        // kein resultat von diesem service, aber rückkehr abwarten
        .pipe(
          map(() => {
            localStorage.removeItem('currentUser');
            this.currentUserSubject.next(UserFactory.empty());}
          ),
          catchError(error => {
            localStorage.removeItem('currentUser');
            // this.currentUserSubject.next(UserFactory.empty()) // nicht nötig, schon closed (error)
            return throwError(of(null))
          })
        );
  }

  refreshToken(): Observable<User> {
    return this.http.post<UserRaw>(
      `${environment.apiUrl}/refresh`, null)
      .pipe(
        map(userRaw => UserFactory.fromRaw(userRaw)),
        map(user => {
        // client persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
        }),
        catchError(this.errorHandler)
      );
  }

  // let user re-type their passwords in case of increased security needs
  verifyPassword(password: string): Observable<boolean> {
    return this.http.post<any>(
      `${environment.apiUrl}/user/verifyPass`, { loginName: this.currentUserValue.loginName, password })
        .pipe(
          map(response => response.granted),
          catchError(this.errorHandler));
  }

  // ToDO: Error Handling (mit Handler-Proc) und Komponente
  changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
    return this.http.post<any>(
      `${environment.apiUrl}/user/changePass`, { loginName: this.currentUserValue.loginName, currentPWD: oldPassword, newPWD: newPassword })
        .pipe(
          catchError(this.errorHandler));
  }

  // may return { id: string } or { api-error (ToDo) }
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
