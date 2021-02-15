import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  loadingError = ''; // prov


  // TODO:
  // orobieren
  // https://codinglatte.com/posts/angular/angular-async-pipe-handle-errors/

  // ToDO: Option C
  // https://blog.eyas.sh/2020/05/better-loading-and-error-handling-in-angular/



  constructor(
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id; // gemäss app.routing
    //this.user$ = this.userService.getSingle(this.userId);

    this.user$ = this.userService.getSingle(this.userId)
      .pipe(
        catchError(() => { // error
          this.loadingError = 'somthing went wrong' // error.statusText;
          return of(UserFactory.empty())
        })
      )
  }

}
