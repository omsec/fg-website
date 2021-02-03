import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Course } from 'src/app/models/course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'fg-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit {
  course: Course | undefined;
  loadingErr = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => {
        let str = params.get('id') // name gemäss routing
        console.log(str);
        if (str) {
          return str
        }
        else return ''
      }),
      switchMap((courseId: string) => this.courseService.getSingle(courseId))
    ).subscribe(
      res => { this.course = res; },
      errMsg => { this.loadingErr = errMsg; }
    );
  }

  // save modification
  updateCourse(course: Course) {
    // console.log(course);
    this.courseService.update(course).subscribe(
      () => {
        // model route auch angeben
        this.router.navigate(['routes/routes', course.id]);
      },
      error => {
        this.loadingErr = error.error.msg;
      }
    );
  }

}
