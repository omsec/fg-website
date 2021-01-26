import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseShow2Component } from './course-show2.component';

describe('CourseShow2Component', () => {
  let component: CourseShow2Component;
  let fixture: ComponentFixture<CourseShow2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseShow2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseShow2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
