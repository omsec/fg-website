import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentingComponent } from './commenting.component';

describe('CommentingComponent', () => {
  let component: CommentingComponent;
  let fixture: ComponentFixture<CommentingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
