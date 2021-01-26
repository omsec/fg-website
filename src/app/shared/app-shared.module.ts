import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';


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
    MessageModule,
    ProgressSpinnerModule,
    AvatarModule,
    DropdownModule,
    InputNumberModule
  ],
  exports: [
    ReactiveFormsModule,
    SharedModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    ProgressSpinnerModule,
    AvatarModule,
    DropdownModule,
    InputNumberModule
  ]
})
export class AppSharedModule { }
