import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HomePage} from './home.page';
import {NesControllerComponentBottomSheetModule} from '../../bottom-sheets/nes-controller/nes-controller-bottom-sheet.module';
import {MatBottomSheetModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatBottomSheetModule,
    NesControllerComponentBottomSheetModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {
}
