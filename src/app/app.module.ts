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
import { AuthenticationErrorInterceptor } from './interceptors/authentication-error.interceptor';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppSharedModule,
    HttpClientModule,
    AuthModule // statisch laden (kein Lazy Loading im Routing)
  ],
  providers: [
    // Reihenfolge 1-2-3 beim Senden und 3-2-1 beim Empfangen; Original Error-Objekt weiterreichen
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
