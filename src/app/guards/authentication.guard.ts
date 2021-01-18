import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.authenticationService.currentUserValue;
      // console.log(currentUser.loginName);

      if (currentUser.loginName !== '') {
        // ist schon eingeloggt
        return true
      }

      // if (route.routeConfig?.path == 'users/:id')
      // console.log(route);

      // noch nicht eingeloggt: zum login
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
  }

}
