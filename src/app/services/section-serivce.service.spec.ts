import { TestBed } from '@angular/core/testing';

import { SectionSerivceService } from './section-serivce.service';

describe('SectionSerivceService', () => {
  let service: SectionSerivceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionSerivceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
