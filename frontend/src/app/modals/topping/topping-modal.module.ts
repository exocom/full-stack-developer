import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToppingModalComponent} from './topping-modal.component';
import {CameraPadModule} from '../../components/camera-pad/camera-pad.module';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadZoneModule} from '../../components/file-upload-zone/file-upload-zone.module';

@NgModule({
  declarations: [ToppingModalComponent],
  entryComponents: [ToppingModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadZoneModule,
    CameraPadModule
  ],
  exports: [ToppingModalComponent]
})
export class ToppingModalModule {
}
