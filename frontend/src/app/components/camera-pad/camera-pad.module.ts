import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CameraPadComponent} from './camera-pad.component';
import {IonicModule} from '@ionic/angular';
import {ImageMessageModule} from '../image-message/image-message.module';

@NgModule({
  declarations: [CameraPadComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImageMessageModule
  ],
  exports: [CameraPadComponent]
})
export class CameraPadModule {
}
