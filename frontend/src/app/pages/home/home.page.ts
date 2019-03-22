import {Component} from '@angular/core';
import {NesControllerBottomSheetComponent} from '../../bottom-sheets/nes-controller/nes-controller-bottom-sheet.component';
import {MatBottomSheet} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(private bottomSheet: MatBottomSheet) {
  }

  openBottomSheet(): void {
    this.bottomSheet.open(NesControllerBottomSheetComponent, {panelClass: 'nes-controller'});
  }
}
