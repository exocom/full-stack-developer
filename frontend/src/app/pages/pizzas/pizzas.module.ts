import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PizzasPage} from './pizzas.page';
import {CloudMessageModule} from '../../components/cloud-message/cloud-message.module';

const routes: Routes = [
  {
    path: '',
    component: PizzasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CloudMessageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PizzasPage]
})
export class PizzasPageModule {
}
