import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {PizzaModalComponent} from './pizza-modal.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadZoneModule} from '../../components/file-upload-zone/file-upload-zone.module';
import {CameraPadModule} from '../../components/camera-pad/camera-pad.module';

@NgModule({
  declarations: [PizzaModalComponent],
  entryComponents: [PizzaModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadZoneModule,
    CameraPadModule
  ],
  exports: [PizzaModalComponent]
})
export class PizzaModalModule {
}
