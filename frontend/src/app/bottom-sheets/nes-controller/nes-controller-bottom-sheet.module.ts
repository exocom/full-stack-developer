import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NesControllerBottomSheetComponent} from './nes-controller-bottom-sheet.component';
import {NesControllerModule} from '../../components/nes-controller/nes-controller.module';

@NgModule({
  declarations: [NesControllerBottomSheetComponent],
  entryComponents: [NesControllerBottomSheetComponent],
  imports: [
    CommonModule,
    NesControllerModule
  ],
  exports: [NesControllerBottomSheetComponent]
})
export class NesControllerComponentBottomSheetModule {
}
