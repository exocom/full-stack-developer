/* tslint:disable:no-switch-case-fall-through */
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Button} from 'selenium-webdriver';
import {AudioService} from '../../services/audio.service';

export type Button = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Start' | 'Select' | 'A' | 'B';

@Component({
  selector: 'app-nes-controller',
  templateUrl: './nes-controller.component.html',
  styleUrls: ['./nes-controller.component.scss']
})
export class NesControllerComponent implements OnInit, OnDestroy {
  @Output() buttonPressed = new EventEmitter<Button>();

  clickAudioBuffer: Promise<AudioBuffer>;

  private keyDown = (event: KeyboardEvent) => {
    let {key} = event;
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

  constructor(private audioService: AudioService) {
  }

  ngOnInit() {
    window.addEventListener('keydown', this.keyDown);
    this.clickAudioBuffer = this.audioService.getBuffer('/assets/audio/click.mp3');
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.keyDown);
  }

  touchStart(e: TouchEvent, button: Button) {
    e.stopPropagation();
    e.preventDefault();
    return this.pushButton(button);
  }

  mouseDown(e: MouseEvent, button: Button) {
    console.log('MOUSE DOWN');
    return this.pushButton(button);
  }

  async pushButton(button: Button) {
    this.buttonPressed.emit(button);
    if (navigator.vibrate) {
      navigator.vibrate([0, 50, 75]);
    }
    await this.audioService.playFromBuffer(await this.clickAudioBuffer);
  }
}
