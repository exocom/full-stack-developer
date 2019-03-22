import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from './models/api';
import {map} from 'rxjs/operators';
import {Topping} from './models/topping';
import {plainToClass} from 'class-transformer';
import {CreateToppingBody} from './models/request';

@Injectable({
  providedIn: 'root'
})
export class ToppingsService {
  private url = 'https://8e08gjdc3d.execute-api.us-west-2.amazonaws.com/dev';
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    reportProgress: true
  };

  constructor(private http: HttpClient) {
  }

  getToppings(): Observable<Array<Topping>> {
    return this.http.get<ApiResponse<Array<Topping>>>(`${this.url}/toppings`, this.httpOptions)
      .pipe(map(body => plainToClass(Topping, body.data)));
  }

  createTopping(createToppingBody: CreateToppingBody): Observable<Topping> {
    return this.http.post<ApiResponse<Topping>>(`${this.url}/toppings`, createToppingBody, this.httpOptions)
      .pipe(map(body => plainToClass(Topping, body.data)));
  }

  removeTopping(toppingId): Observable<void> {
    return this.http.delete<ApiResponse<Topping>>(`${this.url}/toppings/${toppingId}`, this.httpOptions)
      .pipe(map(() => {
      }));
  }
}
