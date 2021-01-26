import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Course } from 'src/app/models/course';
import { CourseFactory } from 'src/app/models/course-factory';
import { Lookup } from 'src/app/models/lookup';
import { LookupTypes } from 'src/app/models/lookup-values';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'fg-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  // https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co/54104796
  form!: FormGroup

  @Input() course: Course | undefined; // ToDO: factory.empty
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
  carClass!: Lookup;

  constructor(
    private route: ActivatedRoute, // für lookups via Resolver
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    // hier platziert vom Resolver
    this.lookups = this.route.snapshot.data.lookups; // evtl. auch in initForm (UPD)

    this.visibility = this.lookupService.getOptions(this.lookups, LookupTypes.Visibility, false);
    this.game = this.lookupService.getOptions(this.lookups, LookupTypes.Game, false);
    this.series = this.lookupService.getOptions(this.lookups, LookupTypes.Series, false);
    this.carClass = this.lookupService.getOptions(this.lookups, LookupTypes.CarClass, false);

    this.initForm();
  }

  // damit das Formular für add & edit benutzt werden kann
  private initForm(): void {
    if (this.form) { return; }

    // Formularmodell
    this.form = this.formBuilder.group({
      //visibility: [this.lookupService.getDefaultValue(this.visibility), Validators.required],
      //game: [this.lookupService.getDefaultValue(this.game), Validators.required],
      forzaSharing: [100000000, [Validators.required, Validators.min(100000000), Validators.max(999999999)]],
      name: ['', Validators.required],
      series: [this.lookupService.getDefaultValue(this.series), Validators.required],
      carClass: [this.lookupService.getDefaultValue(this.carClass), Validators.required], // ToDo: Mehrfachauswahlen vorsehen
    });
  }

  // Hilfsmethode für einfacheren Zugriff auf die Controls
  // https://stackoverflow.com/questions/48538840/what-is-the-type-of-formgroup-controls
  get frm(): { [key: string]: AbstractControl } { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    console.log(this.frm.series.value)

    // Falls das Formular ungültig ist, abbrechen
    if (this.form.invalid) { return; }


    const course = CourseFactory.empty();

    if (this.editing) {
      course.id = this.course?.id;
      course.metaInfo.modifiedID = this.auth.currentUserValue.id;
    } else {
      course.metaInfo.createdID = this.auth.currentUserValue.id
    }
    // visibility
    // game
    course.forzaSharing = this.frm.forzaSharing.value;
    course.name = this.frm.name.value;
    course.seriesCode = this.frm.series.value;
    course.carClassCode = this.frm.carClass.value;

    this.submitCourse.emit(course);
  }

}
