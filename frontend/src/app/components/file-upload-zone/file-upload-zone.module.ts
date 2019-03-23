import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileUploadZoneComponent} from './file-upload-zone.component';
import {FileDropModule} from '../../directives/file-drop/file-drop.module';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [FileUploadZoneComponent],
  imports: [
    CommonModule,
    IonicModule,
    FileDropModule
  ],
  exports: [FileUploadZoneComponent]
})
export class FileUploadZoneModule {
}
