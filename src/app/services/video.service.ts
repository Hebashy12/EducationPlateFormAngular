import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IGetVideo } from '../models/videoModel/iget-video';
import { IEditVideo } from '../models/videoModel/iedit-video';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private apiUrl = `api/Video/`;//section/1


  constructor(private _http: HttpClient) { }

  uploadVideo(formData: FormData): Observable<HttpEvent<any>> {
    return this._http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  editVideo(id:number, updatedVideo:IEditVideo){
    return this._http.put(`${this.apiUrl}${id}`,updatedVideo)
  }
  getVideoById(id:number):Observable<IGetVideo>{
    return this._http.get<IGetVideo>(this.apiUrl+id);
  }
  deleteVideo(id:number){
    return this._http.delete(this.apiUrl+id);
  }
  getVideoBySectionId(id:number):Observable<(IGetVideo[]|null)>{
    return this._http.get<(IGetVideo[]|null)>(this.apiUrl+"section/"+id);
  }
}
