// ng g resolver resolvers/lookup

import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { LookupType } from '../models/lookup';
import { LookupService } from '../services/lookup.service';

@Injectable({
  providedIn: 'root'
})
export class LookupResolver implements Resolve<LookupType[]> {

  // constructor hinzugefügt, service injected und return types angepasst
  constructor(private lookupService: LookupService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LookupType[]> {
    return this.lookupService.getLookups();
  }
}
