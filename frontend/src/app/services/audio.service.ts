import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audioContext: AudioContext;

  constructor() {
    // @ts-ignore
    const isWebkitAudioContext = !!window.webkitAudioContext;
    // @ts-ignore
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      return;
    }
    this.audioContext = new AC();
  }
}
