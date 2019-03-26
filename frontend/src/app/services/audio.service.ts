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
    const data = await this.http.get('path', {responseType: 'arraybuffer'}).toPromise();
    return this.audioContext.decodeAudioData(data);
  }
}
