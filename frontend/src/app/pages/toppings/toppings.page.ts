import {Component, OnInit} from '@angular/core';
import {PizzaService} from '../../services/pizza.service';
import {map, tap} from 'rxjs/operators';
import {Topping, ToppingType} from '../../services/contract/models/topping';

@Component({
  selector: 'app-toppings',
  templateUrl: './toppings.page.html',
  styleUrls: ['./toppings.page.scss']
})
export class ToppingsPage implements OnInit {
  loading = {toppings: true};
  toppingsGroupByType$ = this.pizzaService.getToppings().pipe(
    tap(() => this.loading.toppings = false),
    map((toppings) => {
      return Object.values(ToppingType).map((toppingType): { type: ToppingType, toppings: Array<Topping> } => {
        return {
          type: toppingType,
          toppings: toppings.filter(t => t.type === toppingType)
        };
      });
    })
  );

  constructor(private pizzaService: PizzaService) {
  }

  ngOnInit() {
  }

}
