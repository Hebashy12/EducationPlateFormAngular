import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IGetVideo } from '../models/videoModel/iget-video';

@Injectable({ providedIn: 'root' })
export class VideoServiceService {
  private apiUrl = `${environment.apiUrl}api/Video/`;

  constructor(private _http: HttpClient) { }

  uploadVideo(formData: FormData): Observable<HttpEvent<any>> {
    return this._http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  getVideoById(id:number):Observable<IGetVideo>{
    return this._http.get<IGetVideo>(this.apiUrl+id);
  }
}
