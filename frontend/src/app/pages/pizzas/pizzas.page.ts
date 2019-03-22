import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {PizzaStoreService} from '../../services/pizza-store.service';
import {Pizza} from '../../services/contract/models/pizza';

@Component({
  selector: 'app-pizzas',
  templateUrl: './pizzas.page.html',
  styleUrls: ['./pizzas.page.scss']
})
export class PizzasPage implements OnInit {
  pizzas$ = this.pizzaStoreService.getPizzas();

  constructor(public alertController: AlertController,
              public modalController: ModalController,
              private pizzaStoreService: PizzaStoreService,
              private toastCtrl: ToastController) {
  }

  ngOnInit() {
  }

  async removePizza(pizza: Pizza) {
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
            this.pizzaStoreService.removePizza({pizza}).subscribe(async () => {
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

  createPizza() {
    this.showModal({pizza: null});
  }

  editTopping(pizza: Pizza) {
    this.showModal({pizza});
  }

  private async showModal({pizza}) {
    const modal = await this.modalController.create({
      component: PizzaModalComponent,
      componentProps: {pizza}
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    console.log(data);
  }
}

// TODO : crate modal.
class PizzaModalComponent {}
