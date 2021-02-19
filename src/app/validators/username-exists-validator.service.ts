
import { Injectable } from '@angular/core';
import { FormControl, AsyncValidator, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UsernameExistsValidatorService implements AsyncValidator {

  constructor(private authenticationService: AuthenticationService) { }

  validate(control: FormControl): Observable<ValidationErrors | null> {
    return this.authenticationService.existsUserName(control.value)
      .pipe(map(exists => (exists === false) ? null : {
        userNameExists: { valid: false }
      }),
      catchError(() => of(null))
      );
    }
}
