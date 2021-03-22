import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';

import { AppSharedModule } from '../shared/app-shared.module';
import { VisitorsComponent } from './visitors/visitors.component';


@NgModule({
  declarations: [VisitorsComponent],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    AppSharedModule
  ]
})
export class AnalyticsModule { }
