import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PizzaMessageComponent} from './pizza-message.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [PizzaMessageComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [PizzaMessageComponent]
})
export class PizzaMessageModule {
}
