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

  loading: { toppingValidation: boolean; toppingUpdate: boolean; } = {toppingValidation: false, toppingUpdate: false};

  objectKeys = Object.keys;
  toppingTypes = ToppingType;

  imageFormGroup = this.fb.group({
    dataUrl: [Defaults.topping.image.url],
    url: [null]
  });
  toppingFormGroup = this.fb.group({
    id: [null],
    image: this.imageFormGroup,
    name: [Defaults.topping.name, Validators.required],
    type: [Defaults.topping.type, Validators.required]
  });

  dataUrlFormControl = this.imageFormGroup.get('dataUrl') as FormControl;
  urlFormControl = this.imageFormGroup.get('url') as FormControl;

  toppingDataUrl: string;

  constructor(private fb: FormBuilder,
              private modalController: ModalController,
              navParams: NavParams,
              private pizzaStoreService: PizzaStoreService,
              public toastCtrl: ToastController) {
  }

  async ngOnInit() {
    if (this.topping) {
      this.toppingFormGroup.patchValue(this.topping, {emitEvent: false});
    }
  }

  closeModal() {
    return this.modalController.dismiss(null);
  }

  processPhoto(dataUrl: string) {
    this.toppingDataUrl = dataUrl;
    this.loading.toppingValidation = true;
    this.pizzaStoreService.detectTopping({dataUrl}).subscribe((toppingBase) => {
      const {name, type} = toppingBase;
      this.toppingFormGroup.patchValue({name, type, image: {dataUrl}});

      this.loading.toppingValidation = false;
      this.toppingDataUrl = null;
    }, async (res) => {
      const toast = await this.toastCtrl.create({
        color: 'danger',
        cssClass: 'annoyed',
        message: 'That is not food!\n Please take another photo.',
        showCloseButton: true
      });
      await toast.present();
      this.loading.toppingValidation = false;
      this.toppingDataUrl = null;
    });
  }

  async save() {
    this.loading.toppingUpdate = false;
    if (this.toppingFormGroup.invalid) {
      const toast = await this.toastCtrl.create({
        color: 'danger',
        cssClass: 'annoyed',
        message: 'Form is invalid!\nPlease correct issues and try again.',
        showCloseButton: true
      });
      return toast.present();
    }
    this.loading.toppingUpdate = true;
    const topping = this.toppingFormGroup.value;
    const obs = topping.id ? this.pizzaStoreService.updateTopping({topping}) : this.pizzaStoreService.createTopping({topping});
    obs.subscribe(async () => {
      const toast = await this.toastCtrl.create({
        color: 'success',
        cssClass: 'wink',
        message: `Nice job!\n The topping has been ${topping.id ? 'updated' : 'added'}!`,
        showCloseButton: true,
        duration: 3000
      });
      await toast.present();
      await this.closeModal();
      this.loading.toppingUpdate = false;
    }, async (res) => {
      const message = res && res.error && res.error.error && res.error.error.message || 'Important message goes here!';
      const toast = await this.toastCtrl.create({
        color: 'danger',
        cssClass: 'shocked',
        message: `Something went wrong!\n${message}`,
        showCloseButton: true
      });
      await toast.present();
      this.loading.toppingUpdate = false;
    });
  }
}
