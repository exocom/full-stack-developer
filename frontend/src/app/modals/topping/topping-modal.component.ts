import {Component, Input, OnInit} from '@angular/core';
import {Defaults, Topping, ToppingType} from '../../services/contract/models/topping';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {PizzaStoreService} from '../../services/pizza-store.service';
import {getMIMEType} from 'mim';
import {ImageMimeTypes, ImageUpload} from '../../models/images';
import {switchMap} from 'rxjs/operators';
import {dataUrlRegExp} from '../../services/contract/models/request';
import {randomString} from '../../common/string';
import {debug} from 'util';

type Loading = { toppingValidation: boolean; toppingImage: boolean; toppingUpdate: boolean; };

@Component({
  selector: 'app-topping',
  templateUrl: './topping-modal.component.html',
  styleUrls: ['./topping-modal.component.scss']
})
export class ToppingModalComponent implements OnInit {
  @Input() topping: Topping;

  loading: Loading = {toppingValidation: false, toppingUpdate: false, toppingImage: false};

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

  toppingDataUrl: string | ArrayBuffer;

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

  private async uploadImage({filename, contentType}, {file, base64str}: ImageUpload) {
    this.loading.toppingImage = true;
    if (!Object.values(ImageMimeTypes).includes(contentType)) {
      const toast = await this.toastCtrl.create({
        color: 'danger',
        cssClass: 'annoyed',
        message: 'That is not an image!\n Please select another photo.',
        showCloseButton: true
      });
      await toast.present();
      this.loading.toppingImage = false;
      return;
    }

    this.pizzaStoreService.createToppingImageSignedUrl({filename: file.name, mimeType: file.name})
      .pipe(
        switchMap((signedUrl) => this.pizzaStoreService.uploadToppingImage({signedUrl, contentType}, {file, base64str: base64str})),
        switchMap((url) => {
          console.log(url);
          debugger;
          // TODO : get url from aws payload?
          return url;
          // this.toppingFormGroup.patchValue({image: {filename, url}});
        })
        /*
        .subscribe((toppingBase) => {
  const {name, type} = toppingBase;
  this.toppingFormGroup.patchValue({name, type});

  this.loading.toppingValidation = false;
}, async (res) => {
  const toast = await this.toastCtrl.create({
    color: 'danger',
    cssClass: 'shocked',
    message: `Is that even food!\n Sorry I can't help.`,
    showCloseButton: true
  });
  await toast.present();
  this.loading.toppingValidation = false;
});
         */
        // })
      )
      .subscribe(() => {
        this.loading.toppingImage = false;
      }, async (res) => {
        const message = res && res.error && res.error.error && res.error.error.message || 'Important message goes here!';
        const toast = await this.toastCtrl.create({
          color: 'danger',
          cssClass: 'shocked',
          message: `Something went wrong!\n${message}`,
          showCloseButton: true
        });
        await toast.present();
        this.loading.toppingImage = false;
      });
  }

  processFile(file: File) {
    this.loading.toppingImage = true;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.toppingDataUrl = fileReader.result;
    };
    fileReader.readAsDataURL(file);
    const contentType = getMIMEType(file.name);
    return this.uploadImage({filename: file.name, contentType}, {file});
  }

  processPhoto(dataUrl: string) {
    this.loading.toppingImage = true;
    this.toppingDataUrl = dataUrl;
    const [match, contentType, ext, base64str] = dataUrl.match(dataUrlRegExp);
    const filename = `${this.toppingFormGroup.value.name || randomString(8)}.${ext}`;
    return this.uploadImage({filename, contentType}, {base64str});
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
