import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// shared modules
import { AppSharedModule } from './shared/app-shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationErrorInterceptor } from './interceptors/authentication-error.interceptor';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { UserShowComponent } from './user-show/user-show.component';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    UserShowComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppSharedModule,
    HttpClientModule
  ],
  providers: [
    // Reihenfolge 1-2-3 beim Senden und 3-2-1 beim Empfangen; Original Error-Objekt weiterreichen
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ChangePasswordComponent
  ]
})
export class AppModule { }
