import { TestBed } from '@angular/core/testing';

import { UsernameExistsValidatorService } from './username-exists-validator.service';

describe('UsernameExistsValidatorService', () => {
  let service: UsernameExistsValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsernameExistsValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
