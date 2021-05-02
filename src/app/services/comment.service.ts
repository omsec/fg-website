import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { CommentRaw } from '../models/comment-raw';
import { Comment } from '../models/comment';
import { CommentFactory } from '../models/comment-factory';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService) { }

  getAll(profileId: string): Observable<Comment[]> {
    const noData: Comment[] = [];

    let url = 'public'
    // initialisiert vom auth-Service mit empty()
    if (this.authenticationService.currentUserValue.loginName != '') {
      url = 'member'
    }

    return this.http.get<CommentRaw[]>(
      `${environment.apiUrl}/courses/` + url + `/${profileId}/comments`)
      .pipe(
        // delay(1000), // test loading/error screen
        retry(1),
        map(commentsRaw => {
          // an empty list is null
          if (commentsRaw) {
            return commentsRaw.map(comment => CommentFactory.fromRaw(comment));
          } else {
            return noData; // empty list ist NOT an error
          }
        }),
        catchError(this.errorHandler)
      );
  }

  // may return { id: string } or { api-error }
  add(comment: Comment): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/comment`, comment)
        //.pipe(catchError(this.errorHandler))
        .pipe(
          // this.cleanCourse(course), ToDO: muss wohl obsverable liefern
          catchError(this.errorHandler)
        )
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
