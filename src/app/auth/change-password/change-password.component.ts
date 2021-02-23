import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter, switchMap, tap } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { PasswordValidatorService } from '../../validators/password-validator.service';

@Component({
  selector: 'fg-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  userId = '';
  form!: FormGroup;

  // Status-Variable für GUI-Steuerung
  //loading = false; kann hier wohl entfdernt werden, macht ja der controller
  submitted = false;
  errorMsg = '';
  invalidPwd = false;

  constructor(
    private authenticationService: AuthenticationService,
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userId = this.config.data.id;
    // console.log(this.userId);

    // ToDo: more rules
    // alt/neu ungleich, etc. auch im API, History

    // Formularmodell
    this.form = this.formBuilder.group({
      currentPwd: ['', [Validators.required]],
      newPwd: ['', Validators.compose([
        // 1. Password Field is required
        Validators.required,
        /*
        // 2. check whether the entered password contains a number
        PasswordValidatorService.pattern(/\d/, { hasNumber: true }),
        // 3. check for uppercase letters
        PasswordValidatorService.pattern(/[A-Z]/, { hasCapitalCase: true}),
        // 4. check for lower-case letters
        PasswordValidatorService.pattern(/[a-z]/, { hasSmallCase: true }),
        // 5. check for special characters
        PasswordValidatorService.pattern(/[@#$\^%&äöüÄÖÜ]/, { hasSpecialCharacters: true}),
        */
        // 6. Password minimum length is 8 characters
        Validators.minLength(8)
      ])],
      confirmPwd: ['', [Validators.required]]
    },
    {
      validator: PasswordValidatorService.mustMatch('newPwd', 'confirmPwd')
    });

  }

  // Hilfsmethode für einfacheren Zugriff auf die Controls
  // https://stackoverflow.com/questions/48538840/what-is-the-type-of-formgroup-controls
  get frm(): { [key: string]: AbstractControl } { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    //     console.log(this.frm.series.value)

    // Falls das Formular ungültig ist, abbrechen
    if (this.form.invalid) { return; }

    // ToDo: inv Class
    // https://primefaces.org/primeng/showcase/#/inputtext
    // class="ng-invalid ng-dirty"

    // ToDo: Info Notification wenn successful

    this.authenticationService.verifyPassword(this.frm.currentPwd.value)
      .pipe(
        tap(granted => this.invalidPwd = !granted),
        filter(granted => (granted === true)), // filter for correct entry of current password
        switchMap(() => this.authenticationService.changePassword(this.frm.currentPwd.value, this.frm.newPwd.value))
      ).subscribe(pwdChanged => {
        // true or undefined
        this.ref.close(pwdChanged);
      },
      errMsg => {
        console.log(errMsg);
        this.errorMsg = errMsg;
      });
  }

}
