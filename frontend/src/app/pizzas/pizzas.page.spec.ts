import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzasPage } from './pizzas.page';

describe('PizzasPage', () => {
  let component: PizzasPage;
  let fixture: ComponentFixture<PizzasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PizzasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PizzasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
