import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Course } from 'src/app/models/course';
import { CourseFactory } from 'src/app/models/course-factory';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'fg-course-show2',
  templateUrl: './course-show2.component.html',
  styleUrls: ['./course-show2.component.css']
})
export class CourseShow2Component implements OnInit {
  courseId = '';
  course$: Observable<Course> | undefined;
  loadingErr = '';
  canModify = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params.id; // gemäss app.routing

    // used to signal error (returned by catchError from pipe)
    const noData = CourseFactory.empty();

    this.course$ = this.courseService.getSingle(this.courseId)
      .pipe(
        tap(course => {
          this.canModify = this.courseService.canModify(course);
        }),
        catchError(err => {
          console.log(err);
          this.loadingErr = err;
          return of(noData)
        })
      );
  }

}
