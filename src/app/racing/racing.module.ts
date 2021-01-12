import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RacingRoutingModule } from './racing-routing.module';
import { CourseListComponent } from './course-list/course-list.component';


@NgModule({
  declarations: [CourseListComponent],
  imports: [
    CommonModule,
    RacingRoutingModule
  ]
})
export class RacingModule { }
