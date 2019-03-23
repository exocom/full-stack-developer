import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {CameraService} from '../../services/camera.service';

@Component({
  selector: 'app-camera-pad',
  templateUrl: './camera-pad.component.html',
  styleUrls: ['./camera-pad.component.scss']
})
export class CameraPadComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  @ViewChild('cameraAudio') cameraAudio: ElementRef<HTMLAudioElement>;
  @Output() photoCaptured = new EventEmitter<string>();

  mediaStream: MediaStream;
  videoTrack: MediaStreamTrack;
  cameraPermissions$: Observable<PermissionStatus> = this.cameraService.getCameraPermissionStatus();
  hasCameraHardware: Readonly<boolean> = this.cameraService.hasCameraHardware;

  private cameraAudioMap: {
    audioElement: HTMLAudioElement;
    audioContext: AudioContext;
    track: MediaElementAudioSourceNode;
  };

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

      if (this.cameraAudioMap) {
        const {audioContext} = this.cameraAudioMap;
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    const audioElement = this.cameraAudio.nativeElement;
    // @ts-ignore
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      return;
    }
    const audioContext = new AC();
    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(audioContext.destination);
    this.cameraAudioMap = {audioContext, audioElement, track};
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


  async takePhoto(video: HTMLVideoElement) {
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

    if (!this.cameraAudioMap) {
      return;
    }
    const {audioElement, audioContext} = this.cameraAudioMap;
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    await audioElement.play();
  }
}
