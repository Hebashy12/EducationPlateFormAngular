import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICreateCategory } from '../models/category/icreate-category';
import { Observable } from 'rxjs';
import { IGetCategory } from '../models/category/iget-category';
import { Category } from '../components/add-course/add-course.component';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl="api/Category"
  constructor(private _http:HttpClient) { }

  getCategortByCourseId(courseId:number):Observable<(Category|null)>{
    return this._http.get<(Category|null)>(this.apiUrl+`/course/${courseId}`);
  }

  addCategory(category:ICreateCategory){
    return this._http.post(this.apiUrl,category);
  }
  editCategory(category:ICreateCategory){
    return this._http.put(this.apiUrl,category);
  }
  getAllCategories():Observable<IGetCategory[]>{
    return this._http.get<IGetCategory[]>(this.apiUrl);
  }
  getCategoryById(Id:number):Observable<IGetCategory>{
    return this._http.get<IGetCategory>(this.apiUrl+Id);
  }
  deleteCategoryById(Id:number){
    return this._http.delete(this.apiUrl+Id);
  }
}
