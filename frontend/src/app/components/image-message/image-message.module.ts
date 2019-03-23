import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ImageMessageComponent} from './image-message.component';

@NgModule({
  declarations: [ImageMessageComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ImageMessageComponent]
})
export class ImageMessageModule {
}
