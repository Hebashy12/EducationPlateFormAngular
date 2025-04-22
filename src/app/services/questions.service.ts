import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreteQuestion } from '../models/question/icrete-question';
import { IEditQuestion } from '../models/question/iedit-question';
import { IGetQuestion } from '../models/question/iget-question';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private apiUrl = "api/Question/";
  constructor(private _http:HttpClient) { }
  addQuestion(question:ICreteQuestion){
    return this._http.post(this.apiUrl,question);
  }
  editQuestion(id:number, question:IEditQuestion){
    return this._http.put(this.apiUrl+id,question);
  }
  getQuestionById(id:number):Observable<IGetQuestion>{
    return this._http.get<IGetQuestion>(this.apiUrl+id);
  }

}
