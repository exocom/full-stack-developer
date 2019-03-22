import {Injectable} from '@angular/core';
import {ToppingsService} from './contract/toppings.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Topping} from './contract/models/topping';
import {exhaustMap, shareReplay, tap} from 'rxjs/operators';
import {CreatePizzaBody, CreateToppingBody} from './contract/models/request';
import {Pizza} from './contract/models/pizza';
import {PizzasService} from './contract/pizzas.service';

@Injectable({
  providedIn: 'root'
})
export class PizzaStoreService {
  private _refreshToppings: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private _refreshPizzas: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private pizzasService: PizzasService, private toppingsService: ToppingsService) {
  }

  getToppings(): Observable<Array<Topping>> {
    return this._refreshToppings.asObservable().pipe(
      exhaustMap(() => this.toppingsService.getToppings()),
      shareReplay(1)
    );
  }

  createTopping({topping}: { topping: CreateToppingBody }): Observable<Topping> {
    return this.toppingsService.createTopping(topping).pipe(
      tap(() => this._refreshToppings.next(true))
    );
  }

  removeTopping({topping}: { topping: Topping }): Observable<void> {
    return this.toppingsService.removeTopping(topping.id).pipe(
      tap(() => this._refreshToppings.next(true))
    );
  }

  getPizzas(): Observable<Array<Pizza>> {
    return this._refreshPizzas.asObservable().pipe(
      exhaustMap(() => this.pizzasService.getPizzas()),
      shareReplay(1)
    );
  }

  createPizza({pizza}: { pizza: CreatePizzaBody }): Observable<Pizza> {
    return this.pizzasService.createPizza(pizza).pipe(
      tap(() => this._refreshPizzas.next(true))
    );
  }

  removePizza({pizza}: { pizza: Pizza }): Observable<void> {
    return this.pizzasService.removePizza(pizza.id).pipe(
      tap(() => this._refreshPizzas.next(true))
    );
  }
}
