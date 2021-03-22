import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Tracking } from 'src/app/models/tracking';
import { TrackingFactory } from 'src/app/models/tracking-factory';
import { TrackingService } from 'src/app/services/tracking.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fg-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {
  profileId = '';
  visitors$: Observable<Tracking[]> | undefined
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private trackingService: TrackingService
  ) { }

  ngOnInit(): void {
    // used to signal error (returned by catchError from pipe)
    // const noData = TrackingFactory.empty

// inhalt dynamisch laden (link auf gleiche Route/Component)
this.route.paramMap.subscribe(params => {
  let currentId = params.get('id');
  if (currentId) {
    this.profileId = currentId;
    this.visitors$ = this.trackingService.getVisitors(this.profileId, environment.releaseDate) // später ein Control/Form für das Datum
      .pipe(
        catchError(err => {
          // console.log(err);
          this.errorMsg = err;
          return of([])
        })
      );
  }
});
  }

}
