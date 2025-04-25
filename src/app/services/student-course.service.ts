import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetStudentCourse } from '../models/studentCourse/iget-student-course';

@Injectable({
  providedIn: 'root'
})
export class StudentCourseService {
private apiUrl="api/StudentCourse/"
  constructor(private _http:HttpClient) { }
  getUserCourses():Observable<IGetStudentCourse[]|null>{
    return this._http.get<IGetStudentCourse[]|null>(this.apiUrl+"by-student");
  }
}
