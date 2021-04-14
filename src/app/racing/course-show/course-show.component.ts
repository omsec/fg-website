import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Course } from 'src/app/models/course';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CourseService } from 'src/app/services/course.service';
import { environment } from '../../../environments/environment';
import { CarClass } from '../../models/lookup-values';

@Component({
  selector: 'fg-course-show',
  templateUrl: './course-show.component.html',
  styleUrls: ['./course-show.component.css']
})
export class CourseShowComponent implements OnInit {
  courseId = '';
  course: Course | undefined
  errorMsg = ''; // '' = loading, sonst default TExt
  canModify = false;
  visits = 0;
  // falls der aktuelle User benötigt würde, auth-Service privat importieren
  // und in ngInit als ersten initialisieren
  // rechte-steuerung soll aber möglichst über den Service erfolgen (canMody, showControl panel etc.)
  currentUserId = '';

  // look-up symbols used in template
  CARCLASS = CarClass

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private authenticationService: AuthenticationService
  ) { }


  ngOnInit(): void {

    this.currentUserId = this.authenticationService.currentUserValue.id;

    // inhalt dynamisch laden (link auf gleiche Route/Component)
    this.route.paramMap.subscribe(params => {
      this.course = undefined; // make loading animation re-appear after a route change
      let currentId = params.get('id');
      if (currentId) {
        this.courseId = currentId;
        this.courseService.getSingle(this.courseId).subscribe(
          res => {
            this.course = res;
            this.canModify = this.courseService.canModify(this.course);
            // https://stackoverflow.com/questions/1296358/how-to-subtract-days-from-a-plain-date
          },
          errMsg => { this.errorMsg =  errMsg; } // in der Komponente nur Fehler anzeigen, nicht interpretieren
        );
        // call this independently from the main entity
        this.courseService.getVisits(this.courseId, environment.releaseDate).subscribe(
          res => { this.visits = res; },
          // just hide in case of an error
          () => { this.visits - 1}
        )
      }
    });


    /*
    // statische variante - nicht mehr benutzen
    this.courseId = this.route.snapshot.params.id; // gemäss app.routing
    this.courseService.getSingle(this.courseId).subscribe(
      res => {
        this.course = res;
        this.canModify = this.courseService.canModify(this.course);
      },
      errMsg => { this.loadingErr =  errMsg; } // in der Komponente nur Fehler anzeigen, nicht interpretieren
    )
    */
  }
}
