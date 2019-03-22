import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pizza-message',
  templateUrl: './pizza-message.component.html',
  styleUrls: ['./pizza-message.component.scss']
})
export class PizzaMessageComponent implements OnInit {
  @Input() emoji: 'annoyed' | 'bitten' | 'crumbs' | 'cut-in-half' | 'sleeping' | 'barf-rainbow';

  constructor() {
  }

  ngOnInit() {
  }

}
