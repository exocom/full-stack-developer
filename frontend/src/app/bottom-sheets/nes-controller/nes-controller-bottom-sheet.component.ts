import {Component} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-nes-controller-bottom-sheet',
  templateUrl: './nes-controller-bottom-sheet.component.html',
  styleUrls: ['./nes-controller-bottom-sheet.component.scss']
})
export class NesControllerBottomSheetComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<NesControllerBottomSheetComponent>) {
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
