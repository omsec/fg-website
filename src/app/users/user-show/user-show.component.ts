import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { User } from '../../models/user';
import { UserFactory } from '../../models/user-factory';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'fg-user-show',
  templateUrl: './user-show.component.html',
  styleUrls: ['./user-show.component.css']
})
export class UserShowComponent implements OnInit {
  userId = '';
  user$: Observable<User> | undefined;
  errorMsg = '';


  // TODO:
  // orobieren
  // https://codinglatte.com/posts/angular/angular-async-pipe-handle-errors/

  // ToDO: Option C
  // https://blog.eyas.sh/2020/05/better-loading-and-error-handling-in-angular/



  constructor(
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    //this.userId = this.route.snapshot.params.id; // gemäss app.routing
    //this.user$ = this.userService.getSingle(this.userId);

    // used to signal error (returned by catchError from pipe)
    const noData = UserFactory.empty();

    // inhalt dynamisch laden (link auf gleiche Route/Component)
    this.user$ = this.route.paramMap.pipe(
      //filter(params => {params.get('id)') != null return ''}),
      map(params => {
        let id = params.get('id');
        if (id) {
          return id;
        } else {
          return ''}
      }),
      switchMap(id => {
        this.userId = id;
        return this.userService.getSingle(id)
          .pipe(catchError(errMsg => {
            this.errorMsg = errMsg;
            return of(noData)
          }));
      })
    );

    /*
    this.route.paramMap.subscribe(params => {
      let currentId = params.get('id');
      if (currentId) {
        this.userId = currentId;

      }
    });
    */

    // staitsch - nicht mehr benutzen
    /*this.user$ = this.userService.getSingle(this.userId)
      .pipe(
        catchError(() => { // error
          this.errorMsg = 'somthing went wrong' // error.statusText;
          return of(UserFactory.empty())
        })
      )
    */
  }

}
