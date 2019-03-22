import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {CloudMessageComponent} from './cloud-message.component';

@NgModule({
  declarations: [CloudMessageComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CloudMessageComponent]
})
export class CloudMessageModule {
}
