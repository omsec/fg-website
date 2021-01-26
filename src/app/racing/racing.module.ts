import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RacingRoutingModule } from './racing-routing.module';
import { AppSharedModule } from '../shared/app-shared.module';

import { CourseListComponent } from './course-list/course-list.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseShowComponent } from './course-show/course-show.component';
import { CourseShow2Component } from './course-show2/course-show2.component';


@NgModule({
  declarations: [CourseListComponent, CourseFormComponent, CourseCreateComponent, CourseShowComponent, CourseShow2Component],
  imports: [
    CommonModule,
    RacingRoutingModule,
    AppSharedModule
  ]
})
export class RacingModule { }
