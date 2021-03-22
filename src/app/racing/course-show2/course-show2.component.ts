import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Course } from 'src/app/models/course';
import { CourseFactory } from 'src/app/models/course-factory';
import { CourseService } from 'src/app/services/course.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'fg-course-show2',
  templateUrl: './course-show2.component.html',
  styleUrls: ['./course-show2.component.css']
})
export class CourseShow2Component implements OnInit {
  courseId = '';
  course$: Observable<Course> | undefined;
  errorMsg = '';
  canModify = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lookupService: LookupService) { } // ToDo: behelfsmässig eingefügt

  ngOnInit(): void {
    // used to signal error (returned by catchError from pipe)
    const noData = CourseFactory.empty(this.lookupService);

    // https://stackoverflow.com/questions/54669179/how-to-subscribe-to-observable-whose-input-depends-on-data-from-other-observable

    // inhalt dynamisch laden (link auf gleiche Route/Component)
    this.route.paramMap.subscribe(params => {
      let currentId = params.get('id');
      if (currentId) {
        this.courseId = currentId;
        this.course$ = this.courseService.getSingle(this.courseId)
          .pipe(
            tap(course => {
              this.canModify = this.courseService.canModify(course);
            }),
            catchError(err => {
              // console.log(err);
              this.errorMsg = err;
              return of(noData)
            })
          );
      }
    });

    /*
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
    */
  }

}
