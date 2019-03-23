import {Component, Input, OnInit} from '@angular/core';
import {Defaults, Topping, ToppingType} from '../../services/contract/models/topping';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {PizzaStoreService} from '../../services/pizza-store.service';

@Component({
  selector: 'app-topping',
  templateUrl: './topping-modal.component.html',
  styleUrls: ['./topping-modal.component.scss']
})
export class ToppingModalComponent implements OnInit {
  @Input() topping: Topping;

  loading: { toppingValidation: boolean; } = {toppingValidation: false};

  objectKeys = Object.keys;
  toppingTypes = ToppingType;

  imageFormGroup = this.fb.group({
    dataUrl: [Defaults.topping.image.url, Validators.required]
  });
  toppingFormGroup = this.fb.group({
    image: this.imageFormGroup,
    name: [Defaults.topping.name, Validators.required],
    type: [Defaults.topping.type, Validators.required]
  });

  dataUrlFormControl = this.imageFormGroup.get('dataUrl') as FormControl;

  toppingDataUrl: string;

  constructor(private fb: FormBuilder,
              private modalController: ModalController,
              navParams: NavParams,
              private pizzaStoreService: PizzaStoreService,
              public toastCtrl: ToastController) {
  }

  ngOnInit() {
  }

  closeModal() {
    return this.modalController.dismiss(null);
  }

  processPhoto(dataUrl: string) {
    this.toppingDataUrl = dataUrl;
    this.loading.toppingValidation = true;
    this.pizzaStoreService.detectTopping({dataUrl}).subscribe((toppingBase) => {
      const {name, type} = toppingBase;
      this.toppingFormGroup.setValue({name, type, image: {dataUrl}});

      this.loading.toppingValidation = false;
      this.toppingDataUrl = null;
    }, async (res) => {
      const toast = await this.toastCtrl.create({
        color: 'danger',
        message: 'That is not food! Please take another photo.',
        showCloseButton: true
      });
      await toast.present();
      this.loading.toppingValidation = false;
      this.toppingDataUrl = null;
    });
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
