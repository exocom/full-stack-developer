import {Component, OnInit} from '@angular/core';
import {PizzaService} from '../../services/pizza.service';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-toppings',
  templateUrl: './toppings.page.html',
  styleUrls: ['./toppings.page.scss']
})
export class ToppingsPage implements OnInit {
  loading = {toppings: true};
  toppings$ = this.pizzaService.getToppings().pipe(
    tap(() => this.loading.toppings = false),
    // map(() => null)
  );

  constructor(private pizzaService: PizzaService) {
  }

  ngOnInit() {
  }

}
