import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs/operators';
import { CourseListItem, CourseSearch, CourseSearchMode } from 'src/app/models/course';
import { Lookup } from 'src/app/models/lookup';
import { Game, LookupTypes, Series } from 'src/app/models/lookup-values';
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
  series!: Lookup; // multi-select

  constructor(
    private route: ActivatedRoute, // für lookups via Resolver
    private lookupService: LookupService,
    private formBuilder: FormBuilder,
    private auth: AuthenticationService, // für "add"-button
    private courseService: CourseService) { }

  ngOnInit(): void {
    this.lookups = this.route.snapshot.data.lookups;
    this.series = this.lookupService.getOptions(this.lookups, LookupTypes.Series, false);

    // benutzt für die fehlerbehandlung
    // service-subscription liefert dann ein leeres observable
    const noData: CourseListItem[] = [];

    // Eingabe-Boxen (Frrmularmodell)
    this.form = this.formBuilder.group({
      //gameCode: [this.lookupService.getDefaultValue(this.game), Validators.required],
      seriesCodes: [[Series.Road, Series.Dirt, Series.Cross], Validators.required], // ToDo: ALL
      searchTerm: ['']
    });

    const initialSearch: CourseSearch = {
      searchMode: CourseSearchMode.Custom,
      gameCode: Game.FH4,
      seriesCodes: [Series.Road, Series.Dirt, Series.Cross], // all
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

    if (this.frm.seriesCodes.value.length == 0) {
      return
    }

    const srch: CourseSearch = {
      searchMode: CourseSearchMode.Custom,
      gameCode: Game.FH4,
      seriesCodes: this.frm.seriesCodes.value,
      searchTerm: this.frm.searchTerm.value
    };

    this.search$?.next(srch);

    // console.log(this.lookupService.getText(this.game, this.frm.gameCode.value));
    // console.log(srch);
  }

}
