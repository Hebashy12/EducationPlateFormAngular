import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICreateSection } from '../models/sectionModel/icreate-section';
import { IUpdateSection } from '../models/sectionModel/iupdate-section';

@Injectable({
  providedIn: 'root'
})
export class SectionSerivceService {
private apiURL=environment.apiUrl+"api/section/";
  constructor(private _httpClient:HttpClient) { }
  addSection(section:ICreateSection){
    return this._httpClient.post(this.apiURL,section);
  }
  editSection(section:IUpdateSection){
    return this._httpClient.put(this.apiURL,section);
  }
  getSections(courseId:number){
    return this._httpClient.get(this.apiURL+`by-course/${courseId}`);
  }
  getSectionById(sectionId:number){
    return this._httpClient.get(this.apiURL+sectionId);
  }
  deleteSection(sectionId:number){
    return this._httpClient.delete(this.apiURL+sectionId);
  }
}
