import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICreateQize } from '../models/quize/icreate-qize';
import { IUpdateQize } from '../models/quize/iupdate-qize';
import { Observable } from 'rxjs';
import { IGetQuiz } from '../models/quize/iget-quiz';
import { IGetQuizWithQuestions } from '../models/quize/iget-quiz-with-questions';
import { Category, CategoryDTO } from '../components/add-category/add-category.component';
import { Quiz, QuizDTO } from '../components/add-quiz/add-quiz.component';
import { Section } from '../components/update-video/update-video.component';

@Injectable({
  providedIn: 'root'
})
export class QuizeService {
  private apiUrl= "api/Quiz/"
  constructor(private _http:HttpClient) { }

  getSectionsByCourseId(courseId: number) {
    return this._http.get<Section[]>(`api/Section/by-course/${courseId}`);
  }

  add(quiz: QuizDTO) {
    return this._http.post<Quiz>('api/Quiz', quiz);
  }

  _getQuizById(quizId: number) {
    return this._http.get<(Quiz|null)>(`api/Quiz/${quizId}`);
  }

  getQuizWithQuestionsById(quizId: number) {
    return this._http.get<(Quiz|null)>(`api/Quiz/${quizId}/questions`);
  }
  update(quizId: number, quiz: Omit<QuizDTO, 'sectionId'>) {
    return this._http.put<Quiz>(`api/Quiz/${quizId}`, quiz,{responseType:"text" as 'json'});
  }

  getCategoryById(categoryId: number) {
    return this._http.get<(Category|null)>(`api/Category/${categoryId}`);
  }


  delete(categoryId: number) {
    return this._http.delete(`api/Category/${categoryId}`);
  }
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
  getQuizQustions(id:number):Observable<IGetQuizWithQuestions>{
    return this._http.get<IGetQuizWithQuestions>(this.apiUrl+`${id}/questions`);
  }
}
