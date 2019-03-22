import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NesControllerComponent} from './nes-controller.component';

@NgModule({
  declarations: [NesControllerComponent],
  imports: [
    CommonModule
  ],
  exports: [NesControllerComponent]
})
export class NesControllerModule {
}
