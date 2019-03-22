import { TestBed } from '@angular/core/testing';

import { PizzaStoreService } from './pizza-store.service';

describe('PizzaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PizzaStoreService = TestBed.get(PizzaStoreService);
    expect(service).toBeTruthy();
  });
});
