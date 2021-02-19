import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'fg-error-test',
  templateUrl: './error-test.component.html',
  styleUrls: ['./error-test.component.css']
})
export class ErrorTestComponent implements OnInit {
  user: User | undefined;
  errorMsg = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getTest('').subscribe(
      res => {
        console.log('COMPONENT: ok');
        this.user = res;
      },
      err => {
        console.log('COMPONENT: ', err);
        this.errorMsg = err;
      }
    )
  }

}
