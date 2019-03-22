import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CameraPadComponent} from './camera-pad.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [CameraPadComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CameraPadComponent]
})
export class CameraPadModule {
}
