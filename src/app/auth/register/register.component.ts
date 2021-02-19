import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserFactory } from 'src/app/models/user-factory';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmailExistsValidatorService } from 'src/app/validators/email-exists-validator.service';
import { PasswordValidatorService } from 'src/app/validators/password-validator.service';
import { UsernameExistsValidatorService } from 'src/app/validators/username-exists-validator.service';

@Component({
  selector: 'fg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  // Status-variablen
  loading = false;
  submitted = false; // Steuerung der Controls im Template
  errorMsg = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userNameExistsValidator: UsernameExistsValidatorService,
    private eMailExistsValidator: EmailExistsValidatorService
  ) { }

  ngOnInit(): void {
    // Formularmodell bauen => Controls und Regeln
    this.form = this.formBuilder.group({
      username: ['', [Validators.required], [this.userNameExistsValidator]],
      eMail: ['', [Validators.required, Validators.email], [this.eMailExistsValidator]],
      password: ['', Validators.compose([
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
      confirmPwd: ['', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]]
    },
    {
      validator: PasswordValidatorService.mustMatch('password', 'confirmPwd')
    });
  }

  // https://stackoverflow.com/questions/48538840/what-is-the-type-of-formgroup-controls
  get frm(): { [key: string]: AbstractControl } { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    //this.authenticationService.existsUserName(this.frm.username.value).subscribe(exists => { console.log(exists) });

    // Falls das Formular ungültig ist, abbrechen
    if (this.form.invalid) { return; }

    this.loading = true;

    const user = UserFactory.empty();

    user.loginName = this.frm.username.value;
    user.password = this.frm.password.value;
    user.eMail = this.frm.eMail.value;

    this.authenticationService.register(user).subscribe(
      id => {
        // model route auch angeben
        this.router.navigate(['/login']); // ToDo: hier könnte allenfalls die UserID mitgegeben werden
      },
      error => {
        console.log('COMPONENT: ', error);
        this.errorMsg = error;
      }
    );
  }

}
