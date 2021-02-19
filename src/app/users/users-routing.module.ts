import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { ErrorTestComponent } from './error-test/error-test.component';

import { UserShowComponent } from './user-show/user-show.component';

const routes: Routes = [
  { path: 'users/:id', component: UserShowComponent, canActivate: [AuthenticationGuard]},
  { path: 'test', component: ErrorTestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
