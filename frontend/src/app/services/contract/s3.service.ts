import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {ImageUpload} from '../../models/images';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  constructor(private http: HttpClient) {
  }

  uploadToSignedUrl(signedUrl, contentType, {file, base64}: ImageUpload) {
    const headers = new HttpHeaders({'Content-Type': contentType});
    const req = new HttpRequest('PUT', signedUrl, file || base64, {
      headers: headers,
      // reportProgress: true // This is required for track upload process
    });
    return this.http.request(req);
  }
}
