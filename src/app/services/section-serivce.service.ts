import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICreateSection } from '../models/sectionModel/icreate-section';
import { IUpdateSection } from '../models/sectionModel/iupdate-section';
import { catchError, Observable, throwError } from 'rxjs';
import { IGetSection } from '../models/sectionModel/iget-section';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private readonly baseUrl = "api/Section"; // 'https://localhost:7098'

  constructor(private http: HttpClient) {}

  addSection(section: ICreateSection): Observable<any> {
    return this.http.post(`api/Section`, section);
  }

  editSection(id:number,section: IUpdateSection): Observable<any> {
    return this.http.put(`api/Section/${id}`, section);
  }

  getSections(courseId: number): Observable<IGetSection[]> {
    return this.http.get<IGetSection[]>(`api/Section/by-course/${courseId}`).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to load sections'));
      })
    );
  }

  getSectionById(sectionId: number): Observable<any> {
    return this.http.get(`api/Section/${sectionId}`);
  }

  deleteSection(sectionId: number): Observable<any> {
    return this.http.delete(`api/Section/${sectionId}`);
  }
}
