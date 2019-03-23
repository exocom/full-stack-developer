import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileDropDirective} from './file-drop.directive';

@NgModule({
  declarations: [FileDropDirective],
  imports: [
    CommonModule
  ],
  exports: [FileDropDirective]
})
export class FileDropModule {
}
