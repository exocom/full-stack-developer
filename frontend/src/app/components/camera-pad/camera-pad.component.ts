import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {CameraService} from '../../services/camera.service';
import {AudioService} from '../../services/audio.service';

@Component({
  selector: 'app-camera-pad',
  templateUrl: './camera-pad.component.html',
  styleUrls: ['./camera-pad.component.scss']
})
export class CameraPadComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  @ViewChild('cameraAudio') cameraAudio: ElementRef<HTMLAudioElement>;
  @Output() photoCaptured = new EventEmitter<string>();
  isPortrait = true;

  mediaStream: MediaStream;
  videoTrack: MediaStreamTrack;
  cameraPermissions$: Observable<PermissionStatus> = this.cameraService.getCameraPermissionStatus();
  hasCameraHardware: Readonly<boolean> = this.cameraService.hasCameraHardware;

  private cameraAudioMap: {
    audioElement: HTMLAudioElement;
    audioContext: AudioContext;
    track: MediaElementAudioSourceNode;
  };

  private orientationChange = () => {
    if (screen && screen.orientation && screen.orientation.type) {
      this.isPortrait = screen && screen.orientation && screen.orientation.type ? !/landscape/gi.test(screen.orientation.type) : true;
    } else {
      const orientation = screen && screen.orientation && screen.orientation.hasOwnProperty('angle')
        ? screen.orientation.angle
        : window.orientation;
      switch (orientation) {
        case 0: // Portrait
        case 180: // Portrait (Upside-down)
          this.isPortrait = true;
          break;
        case -90: // Landscape (Clockwise)
        case 90: // Landscape  (Counterclockwise)
          this.isPortrait = false;
          break;
      }
    }

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
  };

  constructor(private audioService: AudioService, private cameraService: CameraService, private elementRef: ElementRef) {
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
      window.addEventListener('orientationchange', this.orientationChange, false);
      window.addEventListener('resize', this.orientationChange, false);

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
    const audioContext = this.audioService.audioContext;
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
    window.removeEventListener('orientationchange', this.orientationChange);
    window.removeEventListener('resize', this.orientationChange);
  }

  async takePhoto(video: HTMLVideoElement) {
    const {width, height} = this.videoTrack.getSettings();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    const base64imageData = canvas.toDataURL('image/png');

    this.photoCaptured.next(base64imageData);

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
