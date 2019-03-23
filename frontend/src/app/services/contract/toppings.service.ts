import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from './models/api';
import {map} from 'rxjs/operators';
import {Topping, ToppingBase} from './models/topping';
import {plainToClass} from 'class-transformer';
import {CreateToppingBody, UpdateToppingBody} from './models/request';

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

  createToppingImageSignedUrl({filename, mimeType}): Observable<string> {
    return this.http.post <ApiResponse<string>>(`${this.url}/topping-image-signed-url`, {filename, mimeType}, this.httpOptions)
      .pipe(map(body => body.data));
  }

  getToppings(): Observable<Array<Topping>> {
    return this.http.get<ApiResponse<Array<Topping>>>(`${this.url}/toppings`, this.httpOptions)
      .pipe(map(body => plainToClass(Topping, body.data)));
  }

  createTopping(createToppingBody: CreateToppingBody): Observable<Topping> {
    return this.http.post<ApiResponse<Topping>>(`${this.url}/toppings`, createToppingBody, this.httpOptions)
      .pipe(map(body => plainToClass(Topping, body.data)));
  }

  updateTopping(updateToppingBody: UpdateToppingBody): Observable<Topping> {
    return this.http.put<ApiResponse<Topping>>(`${this.url}/toppings/${updateToppingBody.id}`, updateToppingBody, this.httpOptions)
      .pipe(map(body => plainToClass(Topping, body.data)));
  }

  removeTopping(toppingId): Observable<void> {
    return this.http.delete<void>(`${this.url}/toppings/${toppingId}`, this.httpOptions);
  }

  detectTopping(dataUrl): Observable<ToppingBase> {
    return this.http.post<ApiResponse<ToppingBase>>(`${this.url}/detect-topping`, {dataUrl}, this.httpOptions)
      .pipe(map(body => plainToClass(ToppingBase, body.data)));
  }
}
