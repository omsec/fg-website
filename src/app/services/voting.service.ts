import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { ProfileVotes, Vote } from '../models/voting';
import { BusinessDomain } from '../shared/business-domain'


@Injectable({
  providedIn: 'root'
})
export class VotingService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  // TodO: Object Type abstrahieren
  getVotes(domain: BusinessDomain, id: string): Observable<ProfileVotes> {

    let url = domain + 's/';

    // initialisiert vom auth-Service mit empty()
    if (this.authenticationService.currentUserValue.loginName != '') {
      url += 'member'
    } else {
      url += 'public'
    }

    return this.http.get<ProfileVotes>(
      //`${environment.apiUrl}/courses/${courseId}`)
      `${environment.apiUrl}/` + url + `/${id}/votes`)
      .pipe(
        // delay(1000), // testing loading/error in template :-)
        // there will always be a result, even if there are no votes yet
        retry(1),
        catchError(this.errorHandler)
      );
  }

  // ToDO: Object Type abstrahieren
  castVote(domain: BusinessDomain, vote: Vote): Observable<ProfileVotes> {
    return this.http.post<ProfileVotes>(
      `${environment.apiUrl}/` + domain + '/vote', vote).pipe(
        catchError(this.errorHandler))
  }

  // Für lokale Fehrlebehandlung von "Spezialfällen"
  // bpw. abfangen von "No Data" (204) als Fehlermeldung
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    console.log('SERVICE: ', error);
    console.log(error.status);

    if (typeof(error) == 'string') {
      // str: 'null received'
      return throwError('Route not found') // ...and send a human-readable message to the component
    } else {
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
}
