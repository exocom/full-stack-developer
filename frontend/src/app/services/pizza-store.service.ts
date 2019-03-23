import {Injectable} from '@angular/core';
import {ToppingsService} from './contract/toppings.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Topping, ToppingBase} from './contract/models/topping';
import {exhaustMap, shareReplay, tap} from 'rxjs/operators';
import {CreatePizzaBody, CreateToppingBody, UpdateToppingBody} from './contract/models/request';
import {Pizza} from './contract/models/pizza';
import {PizzasService} from './contract/pizzas.service';
import {S3Service} from './contract/s3.service';
import {ImageUpload} from '../models/images';

@Injectable({
  providedIn: 'root'
})
export class PizzaStoreService {
  private _refreshToppings: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private _refreshPizzas: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private pizzasService: PizzasService, private s3Service: S3Service, private toppingsService: ToppingsService) {
  }

  createToppingImageSignedUrl({filename, mimeType}) {
    return this.toppingsService.createToppingImageSignedUrl({filename, contentType: mimeType});
  }

  uploadToppingImage({signedUrl, mimeType}, {file, base64str}: ImageUpload) {
    return this.s3Service.uploadToSignedUrl(signedUrl, mimeType, {file, base64str});
  }

  getToppings(): Observable<Array<Topping>> {
    return this._refreshToppings.asObservable().pipe(
      exhaustMap(() => this.toppingsService.getToppings()),
      shareReplay(1)
    );
  }

  createTopping({topping}: { topping: CreateToppingBody }): Observable<Topping> {
    return this.toppingsService.createTopping(topping).pipe(
      tap(() => this._refreshToppings.next(true))
    );
  }

  updateTopping({topping}: { topping: UpdateToppingBody }): Observable<Topping> {
    return this.toppingsService.updateTopping(topping).pipe(
      tap(() => this._refreshToppings.next(true))
    );
  }

  removeTopping({topping}: { topping: Topping }): Observable<void> {
    return this.toppingsService.removeTopping(topping.id).pipe(
      tap(() => this._refreshToppings.next(true))
    );
  }

  detectTopping({dataUrl}): Observable<ToppingBase> {
    return this.toppingsService.detectTopping(dataUrl);
  }

  getPizzas(): Observable<Array<Pizza>> {
    return this._refreshPizzas.asObservable().pipe(
      exhaustMap(() => this.pizzasService.getPizzas()),
      shareReplay(1)
    );
  }

  createPizza({pizza}: { pizza: CreatePizzaBody }): Observable<Pizza> {
    return this.pizzasService.createPizza(pizza).pipe(
      tap(() => this._refreshPizzas.next(true))
    );
  }

  removePizza({pizza}: { pizza: Pizza }): Observable<void> {
    return this.pizzasService.removePizza(pizza.id).pipe(
      tap(() => this._refreshPizzas.next(true))
    );
  }
}
