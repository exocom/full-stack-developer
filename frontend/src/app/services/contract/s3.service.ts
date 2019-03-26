import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ImageUpload} from '../../models/images';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  constructor(private http: HttpClient) {
  }

  uploadToSignedUrl(signedUrl, mimeType, {file, blob}: ImageUpload) {
    const headers = new HttpHeaders({'Content-Type': mimeType});
    return this.http.put(signedUrl, file || blob, {
      headers: headers,
      reportProgress: true // This is required for track upload process
    });
  }
}
