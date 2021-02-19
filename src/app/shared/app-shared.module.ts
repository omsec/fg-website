import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';

// ToDo: mit Variablen gemäss Buch (Kap Modules)

@NgModule({
  declarations: [],
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
    MessageModule,
    DynamicDialogModule,
    PasswordModule,
    ToastModule,
    AutoCompleteModule,
    MultiSelectModule,
    CheckboxModule
  ],
  exports: [
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
    MessageModule,
    DynamicDialogModule,
    PasswordModule,
    ToastModule,
    AutoCompleteModule,
    MultiSelectModule,
    CheckboxModule
  ]
})
export class AppSharedModule { }
