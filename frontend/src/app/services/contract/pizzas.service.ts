import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiResponse} from './models/api';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {CreatePizzaBody, UpdatePizzaBody, UpdateToppingBody} from './models/request';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Pizza} from './models/pizza';

@Injectable({
  providedIn: 'root'
})
export class PizzasService {
  private url = 'https://iiiybaz72h.execute-api.us-west-2.amazonaws.com/dev';
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    reportProgress: true
  };

  constructor(private http: HttpClient) {
  }

  createPizzaImageSignedUrl({filename, contentType}): Observable<string> {
    return this.http.post <ApiResponse<string>>(`${this.url}/pizza-image-signed-url`, {filename, contentType}, this.httpOptions)
      .pipe(map(body => body.data));
  }

  getPizzas(): Observable<Array<Pizza>> {
    return this.http.get<ApiResponse<Array<Pizza>>>(`${this.url}/pizzas`, this.httpOptions)
      .pipe(map(body => plainToClass(Pizza, body.data)));
  }

  createPizza(createPizzaBody: CreatePizzaBody): Observable<Pizza> {
    return this.http.post<ApiResponse<Pizza>>(`${this.url}/pizzas`, createPizzaBody, this.httpOptions)
      .pipe(map(body => plainToClass(Pizza, body.data)));
  }

  updatePizza(updatePizzaBody: UpdatePizzaBody): Observable<Pizza> {
    return this.http.put<ApiResponse<Pizza>>(`${this.url}/pizzas/${updatePizzaBody.id}`, updatePizzaBody, this.httpOptions)
      .pipe(map(body => plainToClass(Pizza, body.data)));
  }

  removePizza(pizzaId): Observable<void> {
    return this.http.delete<void>(`${this.url}/pizzas/${pizzaId}`, this.httpOptions);
  }
}
