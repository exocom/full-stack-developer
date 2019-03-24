import {Component, Input, OnInit} from '@angular/core';
import {CrustType, Defaults, Pizza, PizzaSize} from '../../services/contract/models/pizza';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {PizzaStoreService} from '../../services/pizza-store.service';
import {ImageMimeTypes, ImageUpload} from '../../models/images';
import {switchMap, tap} from 'rxjs/operators';

interface Loading {
  pizzaValidation: boolean;
  pizzaImage: boolean;
  pizzaUpdate: boolean;
}

@Component({
  selector: 'app-pizza-modal',
  templateUrl: './pizza-modal.component.html',
  styleUrls: ['./pizza-modal.component.scss']
})
export class PizzaModalComponent implements OnInit {
  @Input() pizza: Pizza;

  loading: Loading = {pizzaValidation: false, pizzaUpdate: false, pizzaImage: false};

  objectKeys = Object.keys;
  crustTypes = CrustType;
  pizzaSize = PizzaSize;

  imageFormGroup = this.fb.group({
    filename: [null, Validators.required],
    url: [null]
  });
  pizzaFormGroup = this.fb.group({
    id: [null],
    image: this.imageFormGroup,
    name: [Defaults.pizza.name, Validators.required],
    crust: [Defaults.pizza.crust, Validators.required],
    size: [Defaults.pizza.size, Validators.required],
    price: [Defaults.pizza.size, Validators.required],
    topping: [Defaults.pizza.toppings, Validators.required]
  });

  urlFormControl = this.imageFormGroup.get('url') as FormControl;

  pizzaDataUrl: string | ArrayBuffer;

  constructor(private fb: FormBuilder,
              private modalController: ModalController,
              navParams: NavParams,
              private pizzaStoreService: PizzaStoreService,
              public toastCtrl: ToastController) {
  }

  async ngOnInit() {
    if (this.pizza) {
      this.pizzaFormGroup.patchValue(this.pizza, {emitEvent: false});
    }
  }

  closeModal() {
    return this.modalController.dismiss(null);
  }

  private async uploadImage({filename, mimeType}, {file, base64str}: ImageUpload) {
    this.loading.pizzaImage = true;
    this.loading.pizzaValidation = false;
    this.pizzaFormGroup.disable();
    if (!Object.values(ImageMimeTypes).includes(mimeType)) {
      const toast = await this.toastCtrl.create({
        color: 'danger',
        cssClass: 'annoyed',
        message: 'That is not an image!\n Please select another photo.',
        showCloseButton: true
      });
      await toast.present();
      this.loading.pizzaImage = false;
      this.pizzaFormGroup.enable();
      return;
    }

    this.pizzaStoreService.createPizzaImageSignedUrl({filename, mimeType})
      .pipe(
        switchMap((signedUrl) => {
          return this.pizzaStoreService.uploadPizzaImage({signedUrl, mimeType}, {file, base64str}).pipe(
            tap(() => {
              this.loading.pizzaImage = false;
              this.loading.pizzaValidation = true;
              const url = signedUrl.replace(/\?.*$/, '');
              this.pizzaFormGroup.patchValue({image: {filename, url}});
            })
          );
        })
      )
      .subscribe(async () => {
        this.loading.pizzaImage = false;
        this.loading.pizzaValidation = false;
        this.pizzaFormGroup.enable();
      }, async (res) => {
        const message = res && res.error && res.error.error && res.error.error.message || 'Important message goes here!';
        const toast = await this.toastCtrl.create({
          color: 'danger',
          cssClass: 'shocked',
          message: `Something went wrong!\n${message}`,
          showCloseButton: true
        });
        await toast.present();
        this.loading.pizzaImage = false;
        this.loading.pizzaValidation = false;
        this.pizzaFormGroup.enable();
      });
  }
}
