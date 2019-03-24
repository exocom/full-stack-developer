import {Injectable} from '@angular/core';
import {ToppingsService} from './contract/toppings.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Topping} from './contract/models/topping';
import {exhaustMap, shareReplay, tap} from 'rxjs/operators';
import {CreatePizzaBody, CreateToppingBody, UpdatePizzaBody, UpdateToppingBody} from './contract/models/request';
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

  uploadImage({signedUrl, mimeType}, {file, base64str}: ImageUpload) {
    return this.s3Service.uploadToSignedUrl(signedUrl, mimeType, {file, base64str});
  }

  createToppingImageSignedUrl({filename, mimeType}): Observable<string> {
    return this.toppingsService.createToppingImageSignedUrl({filename, contentType: mimeType});
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
      tap(() => this._refreshToppings.next(true)),
      tap(() => this._refreshPizzas.next(true))
    );
  }

  removeTopping({topping}: { topping: Topping }): Observable<void> {
    return this.toppingsService.removeTopping(topping.id).pipe(
      tap(() => this._refreshToppings.next(true)),
      tap(() => this._refreshPizzas.next(true))
    );
  }

  detectTopping({filename}) {
    return this.toppingsService.detectTopping(filename);
  }

  createPizzaImageSignedUrl({filename, mimeType}): Observable<string> {
    return this.pizzasService.createPizzaImageSignedUrl({filename, contentType: mimeType});
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

  updatePizza({pizza}: { pizza: UpdatePizzaBody }): Observable<Pizza> {
    return this.pizzasService.updatePizza(pizza).pipe(
      tap(() => this._refreshPizzas.next(true))
    );
  }

  removePizza({pizza}: { pizza: Pizza }): Observable<void> {
    return this.pizzasService.removePizza(pizza.id).pipe(
      tap(() => this._refreshPizzas.next(true))
    );
  }
}
