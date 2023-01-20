import { TestBed } from '@angular/core/testing';

import { FormsService } from './forms-service.service';

describe('FormsServiceService', () => {
  let service: FormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
