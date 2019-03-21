import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToppingsPage } from './toppings.page';

describe('ToppingsPage', () => {
  let component: ToppingsPage;
  let fixture: ComponentFixture<ToppingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToppingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToppingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
