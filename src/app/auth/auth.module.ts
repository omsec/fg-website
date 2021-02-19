import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
//import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';

import { AppSharedModule } from '../shared/app-shared.module';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    LoginComponent,
    ChangePasswordComponent,
    RegisterComponent
  ],
  imports: [
    //CommonModule,
    //ReactiveFormsModule,
    AuthRoutingModule,
    AppSharedModule
  ],
  entryComponents: [
    ChangePasswordComponent
  ]
})
export class AuthModule { }
