import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToppingsService {
  private url = 'https://8e08gjdc3d.execute-api.us-west-2.amazonaws.com/dev/';

  constructor() {
  }
}
