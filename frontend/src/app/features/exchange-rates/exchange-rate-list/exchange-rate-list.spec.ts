import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateList } from './exchange-rate-list';

describe('ExchangeRateList', () => {
  let component: ExchangeRateList;
  let fixture: ComponentFixture<ExchangeRateList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeRateList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeRateList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
