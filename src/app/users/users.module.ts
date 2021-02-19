import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
//import { ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';

import { AppSharedModule } from '../shared/app-shared.module';

import { UserShowComponent } from './user-show/user-show.component';
import { ErrorTestComponent } from './error-test/error-test.component';


@NgModule({
  declarations: [
    UserShowComponent,
    ErrorTestComponent
  ],
  imports: [
    //CommonModule,
    //ReactiveFormsModule,
    UsersRoutingModule,
    AppSharedModule
  ]
})
export class UsersModule { }
