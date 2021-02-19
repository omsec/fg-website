
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, map, catchError, delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { CourseListItemRaw, CourseRaw } from '../models/course-raw';
import { CourseListItem, Course, CourseSearch } from '../models/course';
import { CourseListItemFactory, CourseFactory } from '../models/course-factory';
import { AuthenticationService } from './authentication.service';
import { UserRole } from '../models/lookup-values';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService) { }

  getAll(searchSpecs: CourseSearch): Observable<CourseListItem[]> {
    const noData: CourseListItem[] = [];

    // GET hat kein BODY, daher Query Params
    // http://localhost:3000/courses?game=fh5&search=roger
    const params = new HttpParams({
      fromObject: {
        game: searchSpecs.gameText,
        search: searchSpecs.searchTerm
      }
    });
    return this.http.get<CourseListItemRaw[]>(
      `${environment.apiUrl}/courses`, { params })
      .pipe(
        // delay(1000), // test loading/error screen
        retry(1),
        map(coursesRaw => {
          // an empty list is null
          if (coursesRaw) {
            return coursesRaw.map(course => CourseListItemFactory.fromRaw(course));
          } else {
            return noData; // empty list ist NOT an error
          }
        }),
        catchError(this.errorHandler)
      );
  }

  getSingle(courseId: string): Observable<Course> {
    return this.http.get<CourseRaw>(
      `${environment.apiUrl}/courses/${courseId}`)
      .pipe(
        delay(1000), // testing loading/error in template :-)
        retry(1),
        map(courseRaw => {
          // check for empty result (204)
          if (courseRaw) {
            return CourseFactory.fromRaw(courseRaw);
          } else {
            throw 'null received' // convert 204 into an error...(for use in errorHandler)
          }
        }),
        catchError(this.errorHandler)
      );
  }

  // may return { id: string } or { api-error }
  add(course: Course): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/course/add`, course)
        .pipe(catchError(this.errorHandler))
  }

  update(course: Course): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/course/edit/${course.id}`,
      course, // course im Body übergeben
      // { responseType: 'text'} // zerstört error handling!!
    ).pipe(catchError(this.errorHandler))
  }

  existsForzaShare(sharingCode: number): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/course/exists`, { forzaSharing: sharingCode })
    .pipe(map(response => response.exists === true))
  }

  // toggle controls
  // method implemented here, since these rules maybe entity-specific
  canModify(course: Course): boolean {
    // console.log(this.authenticationService.currentUserValue.roleCode)
    // console.log(this.authenticationService.currentUserValue.id)
    // console.log(course.metaInfo.createdID)

    return (
      (this.authenticationService.currentUserValue.roleCode == UserRole.Admin)
        || (this.authenticationService.currentUserValue.id == course.metaInfo.createdID)
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
