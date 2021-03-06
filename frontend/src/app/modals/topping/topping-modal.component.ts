import {Component, Input, OnInit} from '@angular/core';
import {Defaults, Topping, ToppingType} from '../../services/contract/models/topping';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {PizzaStoreService} from '../../services/pizza-store.service';
import {getMIMEType} from 'mim';
import {ImageMimeTypes, ImageUpload} from '../../models/images';
import {switchMap, tap} from 'rxjs/operators';
import {dataUrlRegExp} from '../../services/contract/models/request';
import {dataUrlToBlob, randomString} from '../../common/string';

interface Loading {
  toppingValidation: boolean;
  toppingImage: boolean;
  toppingUpdate: boolean;
}

@Component({
  selector: 'app-topping-modal',
  templateUrl: './topping-modal.component.html',
  styleUrls: ['./topping-modal.component.scss']
})
export class ToppingModalComponent implements OnInit {
  @Input() topping: Topping;

  loading: Loading = {toppingValidation: false, toppingUpdate: false, toppingImage: false};

  objectKeys = Object.keys;
  toppingTypes = ToppingType;

  imageFormGroup = this.fb.group({
    filename: [null, Validators.required],
    url: [null]
  });
  toppingFormGroup = this.fb.group({
    id: [null],
    image: this.imageFormGroup,
    name: [Defaults.topping.name, Validators.required],
    type: [Defaults.topping.type, Validators.required]
  });

  urlFormControl = this.imageFormGroup.get('url') as FormControl;

  tempImageData: string | ArrayBuffer;

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

  private async uploadImage({filename, mimeType}, {file, blob}: ImageUpload) {
    this.loading.toppingImage = true;
    this.loading.toppingValidation = false;
    this.toppingFormGroup.disable();
    if (!Object.values(ImageMimeTypes).includes(mimeType)) {
      const toast = await this.toastCtrl.create({
        color: 'danger',
        cssClass: 'annoyed',
        message: 'That is not an image!\n Please select another photo.',
        showCloseButton: true
      });
      await toast.present();
      this.loading.toppingImage = false;
      this.toppingFormGroup.enable();
      return;
    }

    this.pizzaStoreService.createToppingImageSignedUrl({filename, mimeType})
      .pipe(
        switchMap((signedUrl) => {
          return this.pizzaStoreService.uploadImage({signedUrl, mimeType}, {file, blob}).pipe(
            tap(() => {
              this.loading.toppingImage = false;
              this.loading.toppingValidation = true;
              const url = signedUrl.replace(/\?.*$/, '');
              this.toppingFormGroup.patchValue({image: {filename, url}});
            })
          );
        }),
        switchMap(() => this.pizzaStoreService.detectTopping({filename: `temp/${filename}`}))
      )
      .subscribe(async (toppingBase) => {
        const {name, type} = toppingBase;
        const toast = await this.toastCtrl.create({
          color: 'success',
          cssClass: 'eyebrow',
          message: `Ha\nI know what that is!${!name || !type ? ' Sorta.' : ''}`,
          duration: 3000,
          showCloseButton: true
        });
        await toast.present();

        this.toppingFormGroup.patchValue({name, type});

        this.loading.toppingImage = false;
        this.loading.toppingValidation = false;
        this.toppingFormGroup.enable();
      }, async (res) => {
        const message = res && res.error && res.error.error && res.error.error.message || 'Important message goes here!';
        const toast = await this.toastCtrl.create({
          color: 'danger',
          cssClass: 'shocked',
          message: res && res.status === 404 ? 'Is that even food!\n Sorry I can\'t help.' : `Something went wrong!\n${message}`,
          showCloseButton: true
        });
        await toast.present();
        this.loading.toppingImage = false;
        this.loading.toppingValidation = false;
        this.toppingFormGroup.enable();
      });
  }

  processFile(file: FileList | File) {
    if (file instanceof FileList) {
      file = file[0];
    }
    this.loading.toppingImage = true;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.tempImageData = fileReader.result;
    };
    fileReader.readAsDataURL(file);
    const mimeType = getMIMEType(file.name);
    return this.uploadImage({filename: file.name, mimeType}, {file});
  }

  processDataUrl(dataUrl) {
    this.loading.toppingImage = true;
    this.tempImageData = dataUrl;

    const name = this.toppingFormGroup.value.name || randomString(8);
    const [match, mimeType, ext] = dataUrl.match(dataUrlRegExp);
    const filename = `${name}.${ext}`;
    const blob = dataUrlToBlob(dataUrl);
    return this.uploadImage({filename, mimeType}, {blob});
  }

  removeImage() {
    this.imageFormGroup.patchValue({filename: null, url: null});
  }

  async save() {
    this.loading.toppingUpdate = false;
    if (this.toppingFormGroup.invalid) {
      const toast = await this.toastCtrl.create({
        color: 'danger',
        cssClass: 'annoyed',
        message: 'Form is invalid!\nCorrect issues and try again.',
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
