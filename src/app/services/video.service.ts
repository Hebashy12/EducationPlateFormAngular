import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IGetVideo } from '../models/videoModel/iget-video';
import { IEditVideo } from '../models/videoModel/iedit-video';
import { getVideoFormData2, Section, Video, VideoDTO2 } from '../components/update-video/update-video.component';
import { getVideoFormData, VideoDTO } from '../components/add-video/add-video.component';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private apiUrl = `api/Video/`;//section/1


  constructor(private _http: HttpClient) { }


  getSectionsByCourseId(courseId: number) {
    return this._http.get<Section[]>(`api/Section/by-course/${courseId}`);
  }

  _getVideoById(videoId: number) {
    return this._http.get<(Video|null)>(`api/Video/${videoId}`);
  }
  add(video :VideoDTO) {

    const videoFormData = getVideoFormData(video);

    return this._http.post<Video>('api/Video' ,videoFormData );
   }

   update(videoId:number,video: VideoDTO2) {
    const videoFormData = getVideoFormData2(video);

    return this._http.put<Video>(`api/Video/${videoId}` ,videoFormData );
   }
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
