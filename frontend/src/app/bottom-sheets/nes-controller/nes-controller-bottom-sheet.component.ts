import {Component} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material';
import {ToastController} from '@ionic/angular';

type CouponsCode = 'Konami Code' | 'Hadouken' | 'Persistence';

@Component({
  selector: 'app-nes-controller-bottom-sheet',
  templateUrl: './nes-controller-bottom-sheet.component.html',
  styleUrls: ['./nes-controller-bottom-sheet.component.scss']
})
export class NesControllerBottomSheetComponent {
  private konamiCode = NesControllerBottomSheetComponent.uninterrupted([
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'B',
    'A',
    'Start'
  ]);

  private hadoukenR = NesControllerBottomSheetComponent.uninterrupted([
    'ArrowDown',
    'ArrowDown',
    'ArrowRight',
    'ArrowRight',
    'B'
  ]);

  private hadoukenL = NesControllerBottomSheetComponent.uninterrupted([
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowLeft',
    'B'
  ]);

  private persistence = NesControllerBottomSheetComponent.persistenceGenerator();

  coupons: Array<{ code: CouponsCode, generator: Generator }> = [
    {code: 'Konami Code', generator: this.konamiCode},
    {code: 'Hadouken', generator: this.hadoukenL},
    {code: 'Hadouken', generator: this.hadoukenR},
    {code: 'Persistence', generator: this.persistence}
  ];

  constructor(private bottomSheetRef: MatBottomSheetRef<NesControllerBottomSheetComponent>,
              private toastCtrl: ToastController) {
    this.konamiCode.next(0);
    this.hadoukenR.next(0);
    this.hadoukenL.next(0);
    this.persistence.next(0);
  }


  private static* uninterrupted(seq) {
    let i = 0;
    while (true) {
      const msg = yield;
      if (i === (seq.length - 1)) {
        return true;
      }
      if (msg === seq[i]) {
        i++;
      } else {
        i = 0;
      }
    }
  }

  private static* persistenceGenerator() {
    let i = 1;
    do {
      i++;
      yield;
    } while (i <= 50);
    return true;
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }


  async processSequences(ev) {
    for (const {generator, code} of this.coupons) {
      const result = generator.next(ev);
      if (result.done && result.value) {
        this.bottomSheetRef.dismiss();
        await this.reward(code);
      }
    }
  }

  async reward(code: CouponsCode) {
    let message = '';
    let cssClass = '';
    switch (code) {
      case 'Konami Code':
        message = 'Get 30% off entire order.';
        cssClass = 'happy';
        break;
      case 'Hadouken':
        message = 'Get 1/2 off on 1 pizza.';
        cssClass = 'cut-in-half';
        break;
      case 'Persistence':
        message = 'Get 10% off 1 pizza.';
        cssClass = 'sleeping';
        break;
    }

    const toast = await this.toastCtrl.create({
      color: 'dark',
      cssClass,
      message: `${code}!\n${message}`,
      showCloseButton: true
    });
    await toast.present();
  }
}
