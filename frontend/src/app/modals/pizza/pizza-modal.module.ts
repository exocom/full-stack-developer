import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PizzaModalComponent} from './pizza-modal.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadZoneModule} from '../../components/file-upload-zone/file-upload-zone.module';
import {CameraPadModule} from '../../components/camera-pad/camera-pad.module';
import {NgxMaskIonicModule} from 'ngx-mask-ionic';

@NgModule({
  declarations: [PizzaModalComponent],
  entryComponents: [PizzaModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgxMaskIonicModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadZoneModule,
    CameraPadModule
  ],
  exports: [PizzaModalComponent]
})
export class PizzaModalModule {
}
