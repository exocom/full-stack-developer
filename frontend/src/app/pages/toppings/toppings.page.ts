import {Component, OnInit} from '@angular/core';
import {PizzaService} from '../../services/pizza.service';

@Component({
  selector: 'app-toppings',
  templateUrl: './toppings.page.html',
  styleUrls: ['./toppings.page.scss']
})
export class ToppingsPage implements OnInit {

  toppings$ = this.pizzaService.getToppings();

  constructor(private pizzaService: PizzaService) {
  }

  ngOnInit() {
  }

}
