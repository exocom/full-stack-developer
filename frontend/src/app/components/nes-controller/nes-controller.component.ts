import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Button} from 'selenium-webdriver';

export type Button = 'up' | 'down' | 'left' | 'right' | 'start' | 'select' | 'a' | 'b';

type AudioHashMap = {
  [T in Button]: {
    audioElement: HTMLAudioElement;
    audioContext: AudioContext;
    track: MediaElementAudioSourceNode;
  }
};

@Component({
  selector: 'app-nes-controller',
  templateUrl: './nes-controller.component.html',
  styleUrls: ['./nes-controller.component.scss']
})
export class NesControllerComponent implements AfterViewInit {
  @Output() buttonPressed = new EventEmitter<Button>();
  @ViewChild('upAudio') upAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('downAudio') downAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('leftAudio') leftAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('rightAudio') rightAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('startAudio') startAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('selectAudio') selectAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('aAudio') aAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('bAudio') bAudio: ElementRef<HTMLAudioElement>;

  private audioMap: AudioHashMap = {up: null, down: null, left: null, right: null, start: null, select: null, a: null, b: null};

  constructor() {

  }

  ngAfterViewInit(): void {
    const audioElements: Array<{ key: Button, ref: ElementRef<HTMLAudioElement> }> = [
      {key: 'up', ref: this.upAudio},
      {key: 'down', ref: this.downAudio},
      {key: 'left', ref: this.leftAudio},
      {key: 'right', ref: this.rightAudio},
      {key: 'start', ref: this.startAudio},
      {key: 'select', ref: this.selectAudio},
      {key: 'a', ref: this.aAudio},
      {key: 'b', ref: this.bAudio}
    ];

    this.audioMap = audioElements.reduce((obj, {key, ref}, i) => {
      const audioElement = ref.nativeElement;
      const audioContext = new AudioContext();
      const track = audioContext.createMediaElementSource(audioElement);
      track.connect(audioContext.destination);

      obj[key] = {
        audioElement,
        audioContext,
        track
      };
      return obj;
    }, this.audioMap);
  }

  async pushButton(button: Button) {
    this.buttonPressed.emit(button);

    const {audioElement, audioContext} = this.audioMap[button];
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    await audioElement.play();
  }
}
