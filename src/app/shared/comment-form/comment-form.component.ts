import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Comment } from 'src/app/models/comment';
import { CommentFactory } from 'src/app/models/comment-factory';

@Component({
  selector: 'fg-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit, OnChanges {

  @Input() comment = CommentFactory.empty(); // incase it's an edit
  @Input() editing = false; // mode (create, edit)

  // Event für die Steuerkomponente
  @Output() submitComment = new EventEmitter<Comment>();

  // Status & Modus für Template
  submitted = false;

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  // fired when input properties change (happens in edit-mode) - before ngOnInit
  ngOnChanges(): void {
    this.initForm();
    this.setFormValues(this.comment);
  }

  // damit das Formular für add & edit benutzt werden kann
  private initForm() {
  if (this.form) { return; }

  // Formularmodell
  this.form = this.formBuilder.group({
    comment: ['', Validators.required]
    });
  }

  // Felder initialisieren (für edit-Modus)
  private setFormValues(comment: Comment): void {
  this.form.patchValue(comment);
  // ToDo: Felder mit anderem Namen im Formular als im Modell 'manuell' setzen (achtung wenn disabed, siehe Buch)
}

  // Form Controls Accessor
  // https://stackoverflow.com/questions/48538840/what-is-the-type-of-formgroup-controls
  get frm(): { [key: string]: AbstractControl } { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // falls das Formular ungültig ist, abrrechen
    if (this.form.invalid) { return; }

    const comment = CommentFactory.empty();
    comment.comment = this.frm.comment.value;

    this.submitComment.emit(comment)

    this.frm.comment.setValue(''); // gibt error style aus :-/
  }

}
