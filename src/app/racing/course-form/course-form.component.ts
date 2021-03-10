import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { Course, CourseListItem, CourseRef, CourseSearch, CourseSearchMode } from 'src/app/models/course';
import { CourseFactory } from 'src/app/models/course-factory';
import { Lookup } from 'src/app/models/lookup';
import { CourseStyle, Game, LookupTypes } from 'src/app/models/lookup-values';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CourseService } from 'src/app/services/course.service';
import { LookupService } from 'src/app/services/lookup.service';
// import { ShareCodeExistsValidatorService } from 'src/app/validators/sharecode-exists-validator.service';

@Component({
  selector: 'fg-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit, OnChanges {
  // https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co/54104796
  form!: FormGroup

  @Input() course = CourseFactory.empty(this.lookupService);
  @Input() editing = false; // mode (create, edit)

  // Event für die Steuerkomponente
  @Output() submitCourse = new EventEmitter<Course>();

  // Status-Variable für GUI-Steuerung
  //loading = false; kann hier wohl entfdernt werden, macht ja der controller
  submitted = false;

  // Code Look-up
  lookups: Lookup[] = []

  visibility!: Lookup;
  game!: Lookup;
  type!: Lookup;
  series!: Lookup;
  style!: Lookup;
  carClasses!: Lookup; // options, multi-select

  routes: CourseListItem[] = [];
  routes$ = new Subject<CourseSearch>();
  searchingRouteFailedMsg = '';

  constructor(
    private route: ActivatedRoute, // für lookups via Resolver
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private lookupService: LookupService,
    private courseService: CourseService
    // private shareCodeExistsValidator: ShareCodeExistsValidatorService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // fired when input properties change (happens in edit-mode) - before ngOnInit
  ngOnChanges(): void {
    this.initForm();
    this.setFormValues(this.course);
  }

  // damit das Formular für add & edit benutzt werden kann
  private initForm(): void {
    if (this.form) { return; }

    // hier platziert vom Resolver
    this.lookups = this.route.snapshot.data.lookups;

    this.visibility = this.lookupService.getOptions(this.lookups, LookupTypes.Visibility, false);
    this.game = this.lookupService.getOptions(this.lookups, LookupTypes.Game, false);
    this.series = this.lookupService.getOptions(this.lookups, LookupTypes.Series, false);
    this.style = this.lookupService.getOptions(this.lookups, LookupTypes.CourseStyle, false);
    this.carClasses = this.lookupService.getOptions(this.lookups, LookupTypes.CarClass, false);

    // type-ahead
    this.routes$.asObservable().pipe(
      filter(search => (search.searchTerm == '' || search.searchTerm.length >= 3)),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(search => this.courseService.getAll(search))).subscribe(
        routes => { this.routes = routes; },
        errMsg => { this.searchingRouteFailedMsg = errMsg; }
      );

    // Formularmodell
    this.form = this.formBuilder.group({
      visibilityCode: [this.course.visibilityCode, Validators.required],
      gameCode: [this.course.gameCode, Validators.required],
      //forzaSharing: [null as unknown as number,
        //[Validators.required, Validators.min(100000000), Validators.max(999999999)], [this.shareCodeExistsValidator]],
        forzaSharing: [null as unknown as number, [Validators.required, Validators.min(100000000), Validators.max(999999999)]],
      name: ['', Validators.required],
      seriesCode: [this.course.seriesCode, Validators.required],
      styleCode: [this.course.styleCode, Validators.required],
      carClassesCode: [this.course.carClassesCode, Validators.required],
      // carClassesCode: [null, Validators.required], // multiselection kann leer gelassen werden
      route: [null, Validators.required], // type: Course
      tags: [[] as string[]]
    });
  }

  // Felder initialisieren (für edit-Modus)
  private setFormValues(course: Course): void {
    this.form.patchValue(course);
    // Felder mit anderem Namen im Formular als im Modell 'manuell' setzen (achtung wenn disabed, siehe Buch)
  }

  // Hilfsmethode für einfacheren Zugriff auf die Controls
  // https://stackoverflow.com/questions/48538840/what-is-the-type-of-formgroup-controls
  get frm(): { [key: string]: AbstractControl } { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Falls das Formular ungültig ist, abbrechen
    if (this.form.invalid) { return; }

    const course = CourseFactory.empty(this.lookupService);

    if (this.editing) {
      course.id = this.course?.id;
      course.metaInfo.recVer = this.course.metaInfo.recVer; // return original recVer (optimistic locking)
      course.metaInfo.modifiedID = this.auth.currentUserValue.id;
    } else {
      course.metaInfo.createdID = this.auth.currentUserValue.id
    }
    course.visibilityCode = this.frm.visibilityCode.value;
    course.gameCode = this.frm.gameCode.value;
    course.forzaSharing = this.frm.forzaSharing.value;
    course.name = this.frm.name.value;
    course.seriesCode = this.frm.seriesCode.value;
    course.styleCode = this.frm.styleCode.value;
    course.carClassesCode = this.frm.carClassesCode.value;
    // könnte auch in der Factory erstellt werden
    let route: CourseRef = {
      id: this.frm.route.value.id,
      name: this.frm.route.value.name
    }
    course.route = route;
    course.tags = this.frm.tags.value;

    this.submitCourse.emit(course);
  }

  searchRoute(event: any) {
    const seriesCode: number[] = [this.frm.seriesCode.value];
    let search: CourseSearch = {
      searchMode: CourseSearchMode.Standard,
      gameCode: Game.FH4,
      seriesCodes: seriesCode,
      searchTerm: event.query
    };
    this.routes$.next(search);
    //console.log(search);
  }

}
