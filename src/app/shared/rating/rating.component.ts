import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fg-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  // highest rating (stars)
  MAX_STARS = 5

  @Input() rating: number | undefined;
  @Input() showImmediately = false;

  stars: boolean[] = [];

  constructor() { }

  ngOnInit(): void {
    let count = 0;
    if (this.rating) {
      count = this.rating;
    }
    for (let i = 1; i <= this.MAX_STARS; i++) {
      this.stars.push(i > count); // einfügen per true/false
    }
  }

}
