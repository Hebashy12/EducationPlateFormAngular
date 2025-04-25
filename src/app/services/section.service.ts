import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICreateSection } from '../models/sectionModel/icreate-section';
import { IUpdateSection } from '../models/sectionModel/iupdate-section';
import { catchError, Observable, throwError } from 'rxjs';
import { IGetSection } from '../models/sectionModel/iget-section';
import { SectionDTO } from '../components/add-section/add-section.component';
import { SectionDTO2 } from '../components/update-section/update-section.component';
import { Section } from '../components/update-video/update-video.component';
import { PaginatedResponse } from '../components/update-course/update-course.component';
import { Course } from './course.service';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private readonly baseUrl = "api/Section"; // 'https://localhost:7098'

  constructor(private http: HttpClient) {}
  getAllCourses():Observable<PaginatedResponse<Course>> {

    return this.http.get<PaginatedResponse<Course>>('api/Course/All-Courses');

    }
  add(section:SectionDTO){
    return this.http.post('api/Section',section);
  }
  update(sectionId:number,section:SectionDTO2){
    return this.http.put<SectionDTO>(`api/Section/${sectionId}`,section);

  }

  getSectionById(sectionId:number):Observable<Section>{
    return this.http.get<Section>(`api/Section/${sectionId}`);
  }

  addSection(section: ICreateSection): Observable<any> {
    return this.http.post(`api/Section`, section);
  }

  editSection(id:number,section: IUpdateSection): Observable<any> {
    return this.http.put(`api/Section/${id}`, section);
  }

  getSections(courseId: number): Observable<(IGetSection[]|null)> {
    return this.http.get<(IGetSection[]|null)>(`api/Section/by-course/${courseId}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to load sections'));
      })
    );
  }

  _getSectionById(sectionId: number): Observable<any> {
    return this.http.get<Section>(`api/Section/${sectionId}`);
  }

  deleteSection(sectionId: number): Observable<any> {
    return this.http.delete(`api/Section/${sectionId}`);
  }
}
