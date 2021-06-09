import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ForzasharePipe } from '../pipes/forzashare.pipe'
import { EnvPipe } from '../pipes/env.pipe';

import { SharedModule } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChipsModule } from 'primeng/chips';
//import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';

import { RatingComponent } from './rating/rating.component';
import { DelayDirective } from './delay.directive';
import { VotingComponent } from './voting/voting.component';
import { CommentingComponent } from './commenting/commenting.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { CommentCreateComponent } from './comment-create/comment-create.component';
import { CommentEditComponent } from './comment-edit/comment-edit.component';

// ToDo: mit Variablen gemäss Buch (Kap Modules) - achtung Pipes nicht in imports

@NgModule({
  declarations: [
    ForzasharePipe,
    EnvPipe,
    RatingComponent,
    DelayDirective,
    VotingComponent,
    CommentingComponent,
    CommentFormComponent,
    CommentCreateComponent,
    CommentEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    ProgressSpinnerModule,
    AvatarModule,
    DropdownModule,
    InputNumberModule,
    MessagesModule,
    MessageModule,
    DynamicDialogModule,
    PasswordModule,
    ToastModule,
    AutoCompleteModule,
    MultiSelectModule,
    CheckboxModule,
    SelectButtonModule,
    ChipsModule,
    //PaginatorModule,
    TableModule,
    InputTextareaModule,
    FieldsetModule,
    TagModule,
    CardModule,
    FileUploadModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ForzasharePipe,
    EnvPipe,
    SharedModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    ProgressSpinnerModule,
    AvatarModule,
    DropdownModule,
    InputNumberModule,
    MessagesModule,
    MessageModule,
    DynamicDialogModule,
    PasswordModule,
    ToastModule,
    AutoCompleteModule,
    MultiSelectModule,
    CheckboxModule,
    SelectButtonModule,
    ChipsModule,
    //PaginatorModule,
    TableModule,
    InputTextareaModule,
    FieldsetModule,
    TagModule,
    CardModule,
    // components - manuell exportiert
    RatingComponent,
    DelayDirective,
    VotingComponent,
    CommentingComponent,
    FileUploadModule
  ]
})
export class AppSharedModule { }
