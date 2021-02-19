import { TestBed } from '@angular/core/testing';

import { EmailExistsValidatorService } from './email-exists-validator.service';

describe('EmailExistsValidatorService', () => {
  let service: EmailExistsValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailExistsValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
