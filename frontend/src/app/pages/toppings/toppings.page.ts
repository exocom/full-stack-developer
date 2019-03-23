import {Component, OnInit} from '@angular/core';
import {PizzaStoreService} from '../../services/pizza-store.service';
import {map, take} from 'rxjs/operators';
import {Topping, ToppingType} from '../../services/contract/models/topping';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {ToppingModalComponent} from '../../modals/topping/topping-modal.component';

@Component({
  selector: 'app-toppings',
  templateUrl: './toppings.page.html',
  styleUrls: ['./toppings.page.scss']
})
export class ToppingsPage implements OnInit {
  toppings$ = this.pizzaStoreService.getToppings();

  toppingsGroupByType$ = this.toppings$.pipe(
    map((toppings) => {
      return Object.values(ToppingType).map((toppingType): { type: ToppingType, toppings: Array<Topping> } => {
        return {
          type: toppingType,
          toppings: toppings.filter(t => t.type === toppingType)
        };
      });
    })
  );

  constructor(public alertController: AlertController,
              public modalController: ModalController,
              private pizzaStoreService: PizzaStoreService,
              private toastCtrl: ToastController) {
  }

  ngOnInit() {
    setTimeout(() => this.createTopping(), 200);
  }

  async removeTopping(topping: Topping) {
    const confirm = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to remove this topping?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Okay',
          handler: () => {
            this.pizzaStoreService.removeTopping({topping}).subscribe(async () => {
              const toast = await this.toastCtrl.create({color: 'secondary', message: 'Your topping has been removed.', duration: 3000});
              await toast.present();
            }, async () => {
              const toast = await this.toastCtrl.create({color: 'danger', message: 'Unable to remove your topping.', duration: 3000});
              await toast.present();
            });
          }
        }
      ]
    });

    await confirm.present();
  }

  createTopping() {
    this.showModal({topping: null});
  }

  editTopping(topping: Topping) {
    this.showModal({topping});
  }

  private async showModal({topping}) {
    const modal = await this.modalController.create({
      component: ToppingModalComponent,
      componentProps: {topping}
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    console.log(data);
  }
}
