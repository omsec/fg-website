import { TestBed } from '@angular/core/testing';

import { LookupResolver } from './lookup.resolver';

describe('LookupResolver', () => {
  let resolver: LookupResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LookupResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
