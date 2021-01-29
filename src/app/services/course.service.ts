
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, map, catchError, delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { CourseListItemRaw, CourseRaw } from '../models/course-raw';
import { CourseListItem, Course, CourseSearch } from '../models/course';
import { CourseListItemFactory, CourseFactory } from '../models/course-factory';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  // ToDO: Term auf struct umstellen (das enthält dann auch gameCode)
  // Permissions prüft der Service via Token/Cookie=>Rolle

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
        catchError(err => {
          // console.log(err);
          return throwError('Please try again later');
        })
      );
  }

  /*
  // Version für POST
  getAll(searchTerm: string): Observable<CourseListItem[]> {
    const noData: CourseListItem[] = [];

    return this.http.post<CourseListItemRaw[]>(
      `${environment.apiUrl}/courses`, { searchTerm })
      .pipe(
        // delay(1000), // test loading/error screen
        retry(1),
        map(coursesRaw => {
          // an empty list is null
          if (coursesRaw) {
            return coursesRaw.map(course => CourseListItemFactory.fromRaw(course));
          } else {
            return noData;
          }
        }),
        catchError(err => {
          // console.log(err);
          return throwError('Please try again later');
        })
      );
  }
  */

  /*
  getAll(searchTerm: string): Observable<CourseListItem[]> {
    return this.http.post<CourseListItemRaw[]>(
      `${environment.apiUrl}/courses`, { searchTerm })
      .pipe(
        retry(1),
        map((coursesRaw => coursesRaw.map(course => CourseListItemFactory.fromRaw(course))))
      );
  }
  */

  // ToDo: getSingle - also check for changed (lowered) visibility and report in show-components (interceptor?)
  getSingle(courseId: string): Observable<Course> {
    return this.http.get<CourseRaw>(
      `${environment.apiUrl}/courses/${courseId}`)
      .pipe(
        // delay(1000), // testing loading/error in template :-)
        retry(1),
        map(courseRaw => {
          // check for empty result (204)
          if (courseRaw) {
            return CourseFactory.fromRaw(courseRaw);
          } else {
            throw 'null received' // convert 204 into an error...
          }
        }),
        catchError(err => {
          if (err == 'null received') {
            err = 'Route not found' // ...and send a human-readable message to the component
          } else {
            err = 'Please try again later'
          }
          return throwError(err)
        })
      );
  }

  /*
  getSingle(courseId: string): Observable<Course> {
    return this.http.get<CourseRaw>(
      `${environment.apiUrl}/courses/${courseId}`)
      .pipe(
        // delay(1000), // testing loading/error in template :-)
        retry(1),
        map(courseRaw => CourseFactory.fromRaw(courseRaw)),
        catchError((err) => {
          //console.log(err); // log the actual error, eg. status 0/unknown Error for time-out
          // "convert" 204/null into an error with human-readable message
          if (err == 'null received') {
            err = 'Route not found'
          } else {
            err = 'Please try again later'
          }

          return throwError(err);
        })
      );
  }
  */

  // may return { id: string } or { api-error }
  // no additional error handliong required - taken care of by api-error interceptor
  add(course: Course): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/course/add`, course) // course im Body übergeben
  }

  existsForzaShare(sharingCode: number): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/course/exists`, { forzaSharing: sharingCode })
    .pipe(map(response => response.exists === true))
  }

}
