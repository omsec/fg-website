import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs/operators';
import { CourseListItem, CourseSearch } from 'src/app/models/course';
import { Lookup } from 'src/app/models/lookup';
import { LookupTypes } from 'src/app/models/lookup-values';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CourseService } from 'src/app/services/course.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'fg-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses$: Observable<CourseListItem[]> | undefined;
  //loadingError = false; // üblicherwiese nur standard-text details/codes, sonst str und aufbereitung im service
  errorMsg = '';
  search$ = new Subject<CourseSearch>();

  form!: FormGroup;
  // Code Look-up
  lookups: Lookup[] = [];
  game!: Lookup;

  constructor(
    private route: ActivatedRoute, // für lookups via Resolver
    private lookupService: LookupService,
    private formBuilder: FormBuilder,
    private auth: AuthenticationService, // für "add"-button
    private courseService: CourseService) { }

  ngOnInit(): void {
    this.lookups = this.route.snapshot.data.lookups;
    this.game = this.lookupService.getOptions(this.lookups, LookupTypes.Game, true); // incl. disables (FH5) for testing

    // benutzt für die fehlerbehandlung
    // service-subscription liefert dann ein leeres observable
    const noData: CourseListItem[] = [];

    // Eingabe-Boxen (Frrmularmodell)
    this.form = this.formBuilder.group({
      //gameCode: [this.lookupService.getDefaultValue(this.game), Validators.required],
      gameCode: [this.lookupService.getDefault(LookupTypes.Game)],
      searchTerm: ['']
    });

    const initialSearch: CourseSearch = {
      gameText: this.lookupService.getText(this.game, this.frm.gameCode.value), // FH4, default set in form's model
      searchTerm: ''
    }

    this.courses$ = this.search$?.pipe(
      filter(srch => (srch.searchTerm.length >= 3) || (srch.searchTerm.length === 0)),
      startWith(initialSearch),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(srch => {
        return this.courseService.getAll(srch).pipe(
          catchError((err) => { // param falls z. B. str vom service ausgelesen werden soll
            console.log(err)
            //this.loadingError = true
            this.errorMsg = err;
            return of(noData)
            }));
        })
    );


    /*
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
  */
  }

  // form access
  get frm() { return this.form.controls; }

  // "Adapter" Methode führt die beiden Suchfelder zusammen
  searchHandler() {

    const srch: CourseSearch = {
      gameText: this.lookupService.getText(this.game, this.frm.gameCode.value),
      // ToDO: Search Mode - custom vs std/all (API = both currently)
      searchTerm: this.frm.searchTerm.value
    };

    this.search$?.next(srch);

    // console.log(this.lookupService.getText(this.game, this.frm.gameCode.value));
    // console.log(srch);
  }

}
