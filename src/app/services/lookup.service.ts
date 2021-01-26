import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { retry, map, catchError, shareReplay, concatMap, exhaustMap, mergeMap, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Lookup } from '../models/lookup';
import { LookupTypes } from '../models/lookup-values';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private lookups: Lookup[] = []

  constructor(private http: HttpClient) { }

  // usually called/subscribed by a resolver
  getLookups(): Observable<Lookup[]> {
    if (this.lookups.length > 0) {
      return of(this.lookups)
    } else  {
      return this.http.get<Lookup[]>(
        `${environment.apiUrl}/lookups`)
        .pipe(
          retry(3),
          // tap lässt das Original-Obsverable in Ruhe und macht quasi "hintenrum" was (hier eine Kopie der Daten in den Cache)
          // (map "frisst" es)
          tap(lt => {
            this.lookups = lt;
          }),
          catchError(this.errorHandler)
        );
    }
  }

  // die some-syntax version wäre wohl effizienter auch hier
  // https://stackoverflow.com/questions/12260529/break-statement-in-javascript-array-map-method
  getOptions(lookupMap: Lookup[], lookupType: LookupTypes, includeDisabled: boolean): Lookup {
    const options: Lookup = { lookupType, values: [] };

    // ToDo: überlegen
    // PM-Dropdown zeigt immer den ersten Wert an; undef ist wohl nicht vorgesehen
    // bei default undef müsste ein 'dummy' eingefügt werden; das "Please select" bleibt dann halt in der Liste

    /*
    options.values.push({
      lookupValue: undefined, // imn interface halt zulassen
      disabled: true,
      default: false, // nicht übersteuern
      indicator: 'not set',
      textEN: '<select>',
      textDE: '<Bitte auswählen>'
    });
    */

    lookupMap.map(lm => { // äusseres "loop" über die Typen
      if (lm.lookupType === lookupType) {
        lm.values.map(lv => { // inneres "loop" über die Werte
          if ((includeDisabled === true) || ((includeDisabled === false) && (lv.disabled === false))) {
            options.values.push({
              lookupValue: lv.lookupValue,
              disabled: lv.disabled,
              default: lv.default,
              indicator: lv.indicator,
              textEN: lv.textEN,
              textDE: lv.textDE
            });
          }
        });
      }
    });

    return options;
  }

  // get default option (for control's initialization)
  // undefined damit das feld leer gelassen werden kann (bspw. für Placeholder Text)
  // wenn es keinen Default-Eintrag gibt
  getDefaultValue(lookup: Lookup): number | undefined {
    let defaultValue = undefined

    // map kann nicht abgebrochen werden - darum for
    // prototype "some" würde auch gehen
    // https://stackoverflow.com/questions/12260529/break-statement-in-javascript-array-map-method

    for (let i = 0; i  < lookup.values.length; i++) {
      if (lookup.values[i].default === true) {
        defaultValue = lookup.values[i].lookupValue;
        break;
      }
    }

    /*
    lookup.values.map(lv => {
      if (lv.default) { defaultValue = lv.lookupValue; }
    });
    */

    return defaultValue;
  }

  // Für lokale Fehrlebehandlung (interceptors sind global)
  // hier kann eine benutzerfeundliche Meldung der Fehler-Codes erzeugt werden, Logging etc.
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    // console.error('Fehler aufgetreten!');
    // console.log(error.status)
    return throwError(error);
  }

}
