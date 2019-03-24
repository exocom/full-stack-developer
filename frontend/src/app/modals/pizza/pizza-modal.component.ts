import {Component, Input, OnInit} from '@angular/core';
import {CrustType, Defaults, Pizza, PizzaSize} from '../../services/contract/models/pizza';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {PizzaStoreService} from '../../services/pizza-store.service';
import {getMIMEType} from 'mim';
import {ImageMimeTypes, ImageUpload} from '../../models/images';
import {switchMap, tap} from 'rxjs/operators';
import {dataUrlRegExp} from '../../services/contract/models/request';
import {randomString} from '../../common/string';

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
  pizzaSizes = PizzaSize;


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
    price: [Defaults.pizza.price, [Validators.required]],
    topping: [Defaults.pizza.toppings]
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
          return this.pizzaStoreService.uploadImage({signedUrl, mimeType}, {file, base64str}).pipe(
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

  processFile(file: FileList | File) {
    if (file instanceof FileList) {
      file = file[0];
    }
    this.loading.pizzaImage = true;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.pizzaDataUrl = fileReader.result;
    };
    fileReader.readAsDataURL(file);
    const mimeType = getMIMEType(file.name);
    return this.uploadImage({filename: file.name, mimeType}, {file});
  }

  processPhoto(dataUrl: string) {
    this.loading.pizzaImage = true;
    this.pizzaDataUrl = dataUrl;
    const [match, mimeType, ext, base64str] = dataUrl.match(dataUrlRegExp);
    const filename = `${this.pizzaFormGroup.value.name || randomString(8)}.${ext}`;
    return this.uploadImage({filename, mimeType}, {base64str});
  }

  removeImage() {
    this.imageFormGroup.patchValue({filename: null, url: null});
  }

  async save() {
    this.loading.pizzaUpdate = false;
    if (this.pizzaFormGroup.invalid) {
      const toast = await this.toastCtrl.create({
        color: 'danger',
        cssClass: 'annoyed',
        message: 'Form is invalid!\nCorrect issues and try again.',
        showCloseButton: true
      });
      return toast.present();
    }
    this.loading.pizzaUpdate = true;
    const pizza = this.pizzaFormGroup.value;
    const obs = pizza.id ? this.pizzaStoreService.updatePizza({pizza}) : this.pizzaStoreService.createPizza({pizza});
    obs.subscribe(async () => {
      const toast = await this.toastCtrl.create({
        color: 'success',
        cssClass: 'wink',
        message: `Nice job!\n The pizza has been ${pizza.id ? 'updated' : 'added'}!`,
        showCloseButton: true,
        duration: 3000
      });
      await toast.present();
      await this.closeModal();
      this.loading.pizzaUpdate = false;
    }, async (res) => {
      const message = res && res.error && res.error.error && res.error.error.message || 'Important message goes here!';
      const toast = await this.toastCtrl.create({
        color: 'danger',
        cssClass: 'shocked',
        message: `Something went wrong!\n${message}`,
        showCloseButton: true
      });
      await toast.present();
      this.loading.pizzaUpdate = false;
    });
  }
}
