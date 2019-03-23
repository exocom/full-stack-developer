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
      message: 'Are you sure you want to remove this pizza?',
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
              const toast = await this.toastCtrl.create({
                color: 'secondary',
                cssClass: 'cloud-crumbs',
                message: 'Om Nom Nom!\n Your pizza has been removed.',
                showCloseButton: true,
                duration: 3000
              });
              await toast.present();
            }, async () => {
              const toast = await this.toastCtrl.create({
                color: 'danger',
                cssClass: 'shocked',
                message: 'Something went wrong!\n Unable to remove your pizza.',
                showCloseButton: true
              });
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
  }
}

// TODO : crate modal.
class PizzaModalComponent {}
