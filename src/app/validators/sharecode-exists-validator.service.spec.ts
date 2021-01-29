import { TestBed } from '@angular/core/testing';

import { ShareCodeExistsValidatorService } from './sharecode-exists-validator.service';

describe('CourseExistsValidatorService', () => {
  let service: ShareCodeExistsValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareCodeExistsValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
