import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audioContext: AudioContext;

  constructor(private http: HttpClient) {
    // @ts-ignore
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      return;
    }
    this.audioContext = new AC();
  }

  async getBuffer(path): Promise<AudioBuffer> {
    const data = await this.http.get(path, {responseType: 'arraybuffer'}).toPromise();
    return new Promise<AudioBuffer>((resolve, reject) => {
      return this.audioContext.decodeAudioData(data, resolve, reject);
    });
  }

  playFromBuffer(buffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(0);

    // NOTE this method could return an Observable. Using the eventListeners.
    /*
    const ended = () => {
      source.removeEventListener('ended', ended);
    };

    source.addEventListener('ended', ended);
     */
  }
}
