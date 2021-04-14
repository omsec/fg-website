import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { formatDate } from '../helpers/date-helper' // import einzelner funktion(en)
import { TrackingRaw } from '../models/tracking-raw';
import { Tracking } from '../models/tracking';
import { TrackingFactory } from '../models/tracking-factory';

// currently not used anymore, since the endpoints are not embedded to the
// respective entities.
// this service maybe later used for additional stat-apis

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private http: HttpClient) { }

  /*
  getVisits(id: string, since: Date): Observable<number> {

    const sinceStr = formatDate(since);
    const params = new HttpParams({
      fromObject: {
        id,
        startDT: sinceStr
      }
    });

    // console.log(sinceStr)

    // may return {visits: INT} or API-Error
    return this.http.get<any>(`${environment.apiUrl}/stats/visits`, { params })
      .pipe(
        map(res => {
          return res.visits
        }),
        catchError(error => {
          // convert any error into "no information signal" (just hide the info in components)
          console.log(error)
          return of(-1)
        })
      );
  }
  */

  getVisitors(id: string, since: Date): Observable<Tracking[]> {

    const noData: Tracking[] = []
    const sinceStr = formatDate(since);
    const params = new HttpParams({
      fromObject: {
        id,
        startDT: sinceStr
      }
    });

    // console.log(sinceStr)

    // may return {visits: INT} or API-Error
    return this.http.get<TrackingRaw[]>(`${environment.apiUrl}/stats/visitors`, { params })
    .pipe(
      retry(1),
      map(visitorsRaw => {
        // an empty list is null
        if (visitorsRaw) {
          return visitorsRaw.map(visitorRaw => TrackingFactory.fromRaw(visitorRaw));
        } else {
          return noData; // empty list ist NOT an error
        }
      }),
      catchError(this.errorHandler)
    );
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
