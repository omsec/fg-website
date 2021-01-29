import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CourseListItem, CourseSearch } from 'src/app/models/course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'fg-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses$: Observable<CourseListItem[]> | undefined;
  loadingError = false; // üblicherwiese nur standard-text details/codes, sonst str und aufbereitung im service

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {

    // benutzt für die fehlerbehandlung
    // service-subscription liefert dann ein leeres observable
    const noData: CourseListItem[] = [];

    // ToDO: Eingabe-Boxen

    this.courses$ = this.courseService.getAll({
      gameText: 'FH4',
      searchTerm: ''
    } as CourseSearch)
    .pipe(
      catchError((err) => { // param falls z. B. str vom service ausgelesen werden soll
        console.log(err)
        this.loadingError = true
        return of(noData)
      })
    );
  }

}
