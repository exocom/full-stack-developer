import {Injectable} from '@angular/core';
import {ToppingsService} from './contract/toppings.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Topping} from './contract/models/topping';
import {exhaustMap, shareReplay, tap} from 'rxjs/operators';
import {CreateToppingBody} from './contract/models/request';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private _refreshToppings: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private toppingsService: ToppingsService) {
  }

  getToppings(): Observable<Array<Topping>> {
    return this._refreshToppings.asObservable().pipe(
      exhaustMap(() => this.toppingsService.getToppings()),
      shareReplay(1)
    );
  }

  createTopping({topping}: { topping: CreateToppingBody }) {
    return this.toppingsService.createTopping({body: topping}).pipe(
      tap(() => this._refreshToppings.next(true))
    );
  }
}
