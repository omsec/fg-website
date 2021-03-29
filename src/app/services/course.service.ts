
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { CourseListItemRaw, CourseRaw } from '../models/course-raw';
import { CourseListItem, Course, CourseSearch, CourseSearchMode } from '../models/course';
import { CourseListItemFactory, CourseFactory } from '../models/course-factory';
import { AuthenticationService } from './authentication.service';
import { CarClass, CourseStyle, UserRole } from '../models/lookup-values';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService) { }

  getAll(searchSpecs: CourseSearch): Observable<CourseListItem[]> {
    const noData: CourseListItem[] = [];

    let seriesStr: string[] = [];
    searchSpecs.seriesCodes.map(seriesCode => {
      seriesStr.push(seriesCode.toString());
    });

    // GET hat kein BODY, daher Query Params; Wiederholungen für Array (series)
    // http://localhost:3000/courses?searchMode=2&game=0&series=0&series=2&search=test
    const params = new HttpParams({
      fromObject: {
        searchMode: searchSpecs.searchMode.toString(),
        game: searchSpecs.gameCode.toString(),
        series: seriesStr,
        search: searchSpecs.searchTerm
      }
    });
    let url = 'public';
    // initialisiert vom auth-Service mit empty()
    if (this.authenticationService.currentUserValue.loginName != '') {
      url = 'member'
    }

    return this.http.get<CourseListItemRaw[]>(
      `${environment.apiUrl}/courses/` + url, { params })
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

    let url = 'public';
    // initialisiert vom auth-Service mit empty()
    if (this.authenticationService.currentUserValue.loginName != '') {
      url = 'member'
    }

    return this.http.get<CourseRaw>(
      //`${environment.apiUrl}/courses/${courseId}`)
      `${environment.apiUrl}/courses/` + url + `/${courseId}`)
      .pipe(
        // delay(1000), // testing loading/error in template :-)
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
      `${environment.apiUrl}/courses`, this.cleanCourse(course))
        //.pipe(catchError(this.errorHandler))
        .pipe(
          // this.cleanCourse(course), ToDO: muss wohl obsverable liefern
          catchError(this.errorHandler)
        )
  }

  // Test: clean using custom operator
  /*
  addTest(course: Course): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/courses`, course)
        //.pipe(catchError(this.errorHandler))
        .pipe(
          this.TestFunc(course),
          catchError(this.errorHandler)
        )
  }
  */

  update(course: Course): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/courses/${course.id}`,
      this.cleanCourse(course), // course im Body übergeben
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

  // performs transformation used by .add and .update
  // ToDo: immutable (entwickler magazin)
  private cleanCourse(course: Course): Course {

    let c = course // ToDo: (deep) copy?

    // if car class "open" (=all) is found in list, remove other items that may exist
    // can't use indexOf as this requires an instance of LookupType which may contain i18n (translated) texts
    if (c.carClassCodes) {
      let found = false;
      for (let i = 0; i < c.carClassCodes.length; i++) {
        if (c.carClassCodes[i].value == CarClass.Open) {
          found = true;
          break;
        }
      }
      c.carClassCodes = [{ value: CarClass.Open} ];
    }

    return { ...c}
  }

  // Test
  // https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
  /*
  private CleanOperator<Course>(course: Course): Observable<Course> {
  }
  */

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
