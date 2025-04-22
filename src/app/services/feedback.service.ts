import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreateFeedBack } from '../models/feedBack/icreate-feed-back';
import { IEditFeedBack } from '../models/feedBack/iedit-feed-back';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedBackService {
  private apiUrl="api/FeedBack/";
  constructor(private _http:HttpClient) { }
  createFeedBack(feedBack:ICreateFeedBack){
    return this._http.post(this.apiUrl,feedBack);
  }
  editFeedBack(id:number, feedBack:IEditFeedBack){
    return this._http.put(this.apiUrl+id,feedBack);
  }
  getFeedBackByVideoId(id:number){
    return this._http.get(this.apiUrl+id);
  }
  deleteFeedBack(id:number){
    return this._http.delete(this.apiUrl+id);
  }
  getSectionRate(id:number):Observable<number>{
    return this._http.get<number>(`${this.apiUrl}sectioRate/${id}`);
  }
}
