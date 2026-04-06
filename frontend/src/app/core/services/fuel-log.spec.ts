import { TestBed } from '@angular/core/testing';

import { FuelLog } from './fuel-log';

describe('FuelLog', () => {
  let service: FuelLog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuelLog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
