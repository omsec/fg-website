import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'fg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  // Status-variablen
  loading = false;
  submitted = false; // Steuerung der Controls im Template

  // ToDO: als Prperty mitgeben (im GUI Button)
  // returnUrl = ''; // falls die Login-Komponente von einer protected Seite aufgerufen wurde

  error = ''; // Fehlermeldung (text)

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
     // Formularmodell bauen => Controls und Regeln
     this.form = this.formBuilder.group({
       username: ['', Validators.required],
       password: ['', Validators.required]
    });
  }

  // https://stackoverflow.com/questions/48538840/what-is-the-type-of-formgroup-controls
  get frm(): { [key: string]: AbstractControl } { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Falls das Formular ungültig ist, abbrechen
    if (this.form.invalid) { return; }

    this.loading = true;

    this.authenticationService.login(this.frm.username.value, this.frm.password.value)
      .pipe(first()) // nur das erste item im observable stream (falls wiedererwarten mehrere kommen)
      .subscribe(
        (usr) => {
          // zurück, wo man her kam --> wenn's /login war, dann / da kein param in der route war
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

          // add user's id to route if required
          if (returnUrl == '/users/') {
            this.router.navigate([returnUrl + usr.id]);
          } else {
            this.router.navigate([returnUrl]);
          }
        },
        (error) => {
          // msg im template über ngIf angezeigt
          if (error.status == 401 || error.status === 403) {
            this.error = error.error
          } else {
            this.error = 'Please try again later'
          }
          this.loading = false;
          // console.log(error)
        }
      );
  }

}
