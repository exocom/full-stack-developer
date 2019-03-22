import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {CameraService} from '../../services/camera.service';

@Component({
  selector: 'app-camera-pad',
  templateUrl: './camera-pad.component.html',
  styleUrls: ['./camera-pad.component.scss']
})
export class CameraPadComponent implements OnInit, OnDestroy {
  @ViewChild('video') video;
  @Output() photoCaptured = new EventEmitter<string>();

  mediaStream: MediaStream;
  videoTrack: MediaStreamTrack;
  cameraPermissions$: Observable<PermissionStatus> = this.cameraService.getCameraPermissionStatus();

  constructor(private cameraService: CameraService, private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.cameraPermissions$.subscribe(async permissionStatus => {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {width: 1280, facingMode: 'environment'},
        audio: false
      });

      if (permissionStatus.state !== 'granted' || !this.mediaStream) {
        return;
      }

      const [videoTrack] = this.mediaStream.getVideoTracks();
      this.videoTrack = videoTrack;
      this.orientationChange();
      window.addEventListener('orientationchange', this.orientationChange.bind(this), false);
      window.addEventListener('resize', this.orientationChange.bind(this), false);
    });
  }

  ngOnDestroy(): void {
    if (this.mediaStream && this.mediaStream.stop) {
      this.mediaStream.stop();
    }
    if (this.videoTrack && this.videoTrack.stop) {
      this.videoTrack.stop();
    }
    window.removeEventListener('orientationchange', this.orientationChange.bind(this));
    window.removeEventListener('resize', this.orientationChange.bind(this));
  }

  private orientationChange() {
    if (!(this.videoTrack && this.video && this.mediaStream)) {
      return;
    }
    // Delay 100ms because the phone (iPad/iPhone/etc) will switch the camera to match orientation.
    // We need to wait for that to happen in order to get the correct width and height.
    setTimeout(() => {
      const video: HTMLVideoElement = this.video.nativeElement;
      const container: HTMLElement = this.elementRef.nativeElement;
      video.width = container.clientWidth;
      video.height = container.clientHeight;
      // https://stackoverflow.com/questions/45692526/ios-11-getusermedia-not-working
      video.srcObject = this.mediaStream;
    }, 100);
  }


  takePhoto(video: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const {width, height} = this.videoTrack.getSettings();
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobileOrTablet = true;

    const w = isMobileOrTablet && isPortrait ? height : width;
    const h = isMobileOrTablet && isPortrait ? width : height;

    canvas.width = w;
    canvas.height = h;

    context.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/png');
    this.photoCaptured.next(dataUrl);
  }
}
