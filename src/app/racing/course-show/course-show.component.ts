import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/models/course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'fg-course-show',
  templateUrl: './course-show.component.html',
  styleUrls: ['./course-show.component.css']
})
export class CourseShowComponent implements OnInit {
  courseId = '';
  course: Course | undefined
  loadingErr = ''; // '' = loading, sonst default TExt

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) { }


  ngOnInit(): void {
    this.courseId = this.route.snapshot.params.id; // gemäss app.routing
    this.courseService.getSingle(this.courseId).subscribe(
      res => { this.course = res;},
      errMsg => { this.loadingErr =  errMsg; } // in der Komponente nur Fehler anzeigen, nicht interpretieren
    )
  }
}
