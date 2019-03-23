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

  uploadToSignedUrl(signedUrl, contentType, {file, base64str}: ImageUpload): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': contentType});
    return this.http.put(signedUrl, file || base64str, {
      headers: headers
      // reportProgress: true // This is required for track upload process
    });
  }
}
