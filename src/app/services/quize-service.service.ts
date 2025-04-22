import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICreateQize } from '../models/quize/icreate-qize';
import { IUpdateQize } from '../models/quize/iupdate-qize';
import { Observable } from 'rxjs';
import { IGetQuiz } from '../models/quize/iget-quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizeService {
  private apiUrl= "api/Quiz/"
  constructor(private _http:HttpClient) { }
  createQuiz(quiz:ICreateQize){
    return this._http.post(this.apiUrl,quiz);
  }
  editQuiz(quiz:IUpdateQize){
    return this._http.put(this.apiUrl,quiz);
  }
  getAllQuizes(){
    return this._http.get(this.apiUrl);
  }
  getQuizById(id:number):Observable<IGetQuiz>{
    return this._http.get<IGetQuiz>(this.apiUrl+id);
  }
  getQuizBySectionId(id:number):Observable<IGetQuiz|null>{
    return this._http.get<IGetQuiz>(this.apiUrl+`bySection/${id}`);
  }
  deleteQuizById(id:number){
    return this._http.delete(this.apiUrl+id);
  }
  getQuizQustions(id:number){
    return this._http.get(this.apiUrl+`${id}/questions`);
  }
}
