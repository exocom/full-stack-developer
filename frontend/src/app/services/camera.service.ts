import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {navigatorPermission} from '../rxjs/rxjs-extensions';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() {
  }

  get hasCameraHardware(): Readonly<boolean> {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  static permissionGranted = new BehaviorSubject({state: 'granted', status: 'granted'} as PermissionStatus).asObservable();

  getCameraPermissionStatus(): Observable<PermissionStatus> {
    if (!(navigator as NavigatorPermissions).permissions) {
      return CameraService.permissionGranted;
    }
    return from((navigator as NavigatorPermissions).permissions.query({name: 'camera'}))
      .pipe(navigatorPermission());
  }
}
