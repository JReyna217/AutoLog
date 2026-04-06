import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelLogList } from './fuel-log-list';

describe('FuelLogList', () => {
  let component: FuelLogList;
  let fixture: ComponentFixture<FuelLogList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelLogList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelLogList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
