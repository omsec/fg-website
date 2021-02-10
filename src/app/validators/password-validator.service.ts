import { ValidationErrors, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

// https://codinglatte.com/posts/angular/cool-password-validation-angular/
// https://jasonwatmore.com/post/2018/11/07/angular-7-reactive-forms-validation-example
export class PasswordValidatorService {
  static pattern(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no errror), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  // custom validator to check that two fields match
  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
  }

}
