import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToppingModalComponent} from './topping-modal.component';
import {CameraPadModule} from '../../components/camera-pad/camera-pad.module';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [ToppingModalComponent],
  entryComponents: [ToppingModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CameraPadModule
  ],
  exports: [ToppingModalComponent]
})
export class ToppingModalModule {
}
