import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'fg-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css']
})
export class CourseCreateComponent {
  errorMsg = '';

  constructor(
    private courseService: CourseService,
    private router: Router
  ) { }

  createCourse(course: Course): void {
    console.log('TEST');

    this.courseService.add(course).subscribe(
      newCourse => {
        // model route auch angeben
        this.router.navigate(['routes/routes', newCourse.id]);
      },
      error => {
        this.errorMsg = error.error.msg;
      }
    );
  }

}
