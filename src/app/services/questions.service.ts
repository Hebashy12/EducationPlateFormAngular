import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreteQuestion } from '../models/question/icrete-question';
import { IEditQuestion } from '../models/question/iedit-question';
import { IGetQuestion } from '../models/question/iget-question';
import { Observable } from 'rxjs';
import { Question, QuestionDTO } from '../components/add-quiz/add-quiz.component';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private apiUrl = "api/Question/";
  constructor(private _http:HttpClient) { }

  getAllQuestionsByQuizId(quizId: number) {
    return this._http.get<Question[]>(`api/Question/by-quiz/${quizId}`);
  }
  add(question: QuestionDTO) {
    return this._http.post<Question>('api/Question', question);
  }

  update(questionId: number, question:Omit< QuestionDTO,'quizId'>) {
    return this._http.put<Question>(`api/Question/${questionId}`, question);
  }

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
