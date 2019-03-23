import {Component, Input, OnInit} from '@angular/core';
import {Topping} from '../../services/contract/models/topping';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-topping',
  templateUrl: './topping-modal.component.html',
  styleUrls: ['./topping-modal.component.scss']
})
export class ToppingModalComponent implements OnInit {
  @Input() topping: Topping;

  constructor(private modalController: ModalController, navParams: NavParams) {
  }

  ngOnInit() {
  }

  closeModal() {
    return this.modalController.dismiss(null);
  }

  processPhoto(dataUrl: string) {
    console.log('Got Photo');
    console.log(dataUrl);
  }

  save() {
    // if (this.signaturePadDirective.signaturePad.isEmpty()) {
    //   return this.modalController.dismiss(null);
    // }
    // // TODO : base64decode SVG/XML then create HTML svg element and trim whitespace. baseEncode and return that mother!
    // // https://gist.github.com/john-doherty/2ad94360771902b16f459f590b833d44
    // const base64imageData = this.signaturePadDirective.cropSignatureCanvas().toDataURL('image/png');
    // return this.modalController.dismiss(base64imageData);
  }
}
