import { TestBed } from '@angular/core/testing';

import { FeedBackServiceService } from './feed-back-service.service';

describe('FeedBackServiceService', () => {
  let service: FeedBackServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedBackServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
