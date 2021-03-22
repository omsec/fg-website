import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { VisitorsComponent } from './visitors/visitors.component';

const routes: Routes = [
  { path: 'visitors/:id', component: VisitorsComponent, canActivate: [AuthenticationGuard]/*, resolve: { lookups: LookupResolver}*/ },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
