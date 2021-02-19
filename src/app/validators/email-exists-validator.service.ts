import { Injectable } from '@angular/core';
import { FormControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs'; import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EmailExistsValidatorService implements AsyncValidator {

  constructor(private authenticationService: AuthenticationService) { }

  validate(control: FormControl): Observable<ValidationErrors | null> {
    return this.authenticationService.existsEMailAddress(control.value)
      .pipe(map(exists => (exists === false) ? null : {
        eMailAddressExists: { valid: false }
      }),
      catchError(() => of(null))
      );
    }
}
