import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NesControllerComponent } from './nes-controller.component';

describe('NesControllerComponent', () => {
  let component: NesControllerComponent;
  let fixture: ComponentFixture<NesControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NesControllerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NesControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
