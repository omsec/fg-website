
import { Injectable } from '@angular/core';
import { FormControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs'; import { map, catchError } from 'rxjs/operators';

import { CourseService } from '../services/course.service';

@Injectable({
  providedIn: 'root'
})
export class ShareCodeExistsValidatorService implements AsyncValidator {

  constructor(private courseService: CourseService) { }

  validate(control: FormControl): Observable<ValidationErrors | null> {
    return this.courseService.existsForzaShare(control.value)
      .pipe(map(exists => (exists === false) ? null : {
        shareCodeExists: { valid: false }
      }),
      catchError(() => of(null))
      );
    }
}
