import { TestBed } from '@angular/core/testing';

import { PizzasService } from './pizzas.service';

describe('PizzasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PizzasService = TestBed.get(PizzasService);
    expect(service).toBeTruthy();
  });
});
