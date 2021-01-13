import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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

  login(username: string, password: string): Observable<User> {
    return this.http.post<UserRaw>(
      `${environment.apiUrl}/login`, { loginName: username, password: password } )
      .pipe(map(userRaw => UserFactory.fromRaw(userRaw)))
      .pipe(map(user => {
        // client persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
    }));
  }

  logout(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/logout`, { responseType: 'text'})
        // kein resultat von diesem service, aber rückkehr abwarten
        .pipe(map(() => {
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(UserFactory.empty());
        }));
  }

  // ToDO: Error Handling: log-out & set empty User => logout
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


}
