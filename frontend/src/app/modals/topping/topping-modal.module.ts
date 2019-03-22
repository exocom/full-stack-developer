import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToppingModalComponent} from './topping-modal.component';
import {CameraPadModule} from '../../components/camera-pad/camera-pad.module';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [ToppingModalComponent],
  entryComponents: [ToppingModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    CameraPadModule
  ],
  exports: [ToppingModalComponent]
})
export class ToppingModalModule {
}