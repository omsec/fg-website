import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { LookupResolver } from '../resolvers/lookup.resolver';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseShowComponent } from './course-show/course-show.component';
// import { CourseShow2Component } from './course-show2/course-show2.component'; // error handling demo using asny pipe

const routes: Routes = [
  { path: '', component: CourseListComponent, resolve: { lookups: LookupResolver} },
  { path: 'routes/:id', component: CourseShowComponent},
  // { path: 'routes/:id', component: CourseShow2Component},
  { path: 'add', component: CourseCreateComponent, canActivate: [AuthenticationGuard], resolve: { lookups: LookupResolver} },
  { path: 'edit/:id', component: CourseEditComponent, canActivate: [AuthenticationGuard], resolve: { lookups: LookupResolver} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RacingRoutingModule { }
