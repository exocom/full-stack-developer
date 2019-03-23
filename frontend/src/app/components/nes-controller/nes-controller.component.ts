import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {Button} from 'selenium-webdriver';

export type Button = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Start' | 'Select' | 'A' | 'B';

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
export class NesControllerComponent implements AfterViewInit, OnDestroy {
  @Output() buttonPressed = new EventEmitter<Button>();
  @ViewChild('upAudio') upAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('downAudio') downAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('leftAudio') leftAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('rightAudio') rightAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('startAudio') startAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('selectAudio') selectAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('aAudio') aAudio: ElementRef<HTMLAudioElement>;
  @ViewChild('bAudio') bAudio: ElementRef<HTMLAudioElement>;

  private audioMap: AudioHashMap = {
    ArrowUp: null, ArrowDown: null, ArrowLeft: null, ArrowRight: null,
    Start: null, Select: null,
    A: null, B: null
  };
  private keyDown = (event: KeyboardEvent) => {
    let {key} = event;
    // noinspection FallThroughInSwitchStatementJS
    switch (key) {
      case 'a':
      case 'b':
        key = key.toUpperCase();
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'A':
      case 'B':
        return this.pushButton(key as Button);
      case 'Enter':
        return this.pushButton('Start');
      case 'Control':
      case 'Shift':
        return this.pushButton('Select');
    }
  };

  constructor() {
    window.addEventListener('keydown', this.keyDown);
  }

  ngAfterViewInit(): void {
    const audioElements: Array<{ key: Button, ref: ElementRef<HTMLAudioElement> }> = [
      {key: 'ArrowUp', ref: this.upAudio},
      {key: 'ArrowDown', ref: this.downAudio},
      {key: 'ArrowLeft', ref: this.leftAudio},
      {key: 'ArrowRight', ref: this.rightAudio},
      {key: 'Start', ref: this.startAudio},
      {key: 'Select', ref: this.selectAudio},
      {key: 'A', ref: this.aAudio},
      {key: 'B', ref: this.bAudio}
    ];

    // @ts-ignore
    const isWebkitAudioContext = !!window.webkitAudioContext;
    // @ts-ignore
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      return;
    }
    const singletonAudioContext = new AC();

    this.audioMap = audioElements.reduce((obj, {key, ref}, i) => {
      const audioElement = ref.nativeElement;
      if (!audioElement) {
        return;
      }
      const audioContext = isWebkitAudioContext ? singletonAudioContext : new AC();
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

  ngOnDestroy(): void {
    console.log();
    window.removeEventListener('keydown', this.keyDown);
  }

  touchStart(button: Button, e: TouchEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.pushButton(button);
  }

  async pushButton(button: Button) {
    if (!(button in this.audioMap)) {
      return;
    }
    this.buttonPressed.emit(button);
    if (this.audioMap[button] === null) {
      return;
    }
    const {audioElement, audioContext} = this.audioMap[button];
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    await audioElement.play();
  }
}
