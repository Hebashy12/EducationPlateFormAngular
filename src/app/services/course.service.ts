import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Category,CourseDTO, getCourseFormData,PaginatedResponse } from '../components/add-course/add-course.component';
import { CourseDTO2 , getCourseFormData2 } from '../components/update-course/update-course.component';

export type Course ={
  courseId: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  courseStatus: 'Completed' | 'NotComplete' | 'WillComingSoon' ; // You can refine this if you know all possible statuses
  categoriesId: number;
  isSequentialWatch: boolean;
  rating: number | null;
  courseImage: string;
  isDeleted: boolean;
  isFree: boolean;
  createOn: string; // ISO date string
  lastUpdateOn: string | null; // ISO date string or null
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private readonly http = inject(HttpClient);

  getCourseById(courseId: number): Observable<{data:(Course|null)}> {
    return this.http.get<{data:(Course|null)}>(`api/Course/${courseId}`);
  }
  getAllCategories(){
    return this.http.get<Category[]>('api/Category');
  }
 getAll () {
   return this.http.get<{data:Course[]}>('api/Course/get-All-Course');
 }

 getCoursesPaginated(pageNumber :number, pageSize : number): Observable<PaginatedResponse<Course>> {
  return this.http.get<PaginatedResponse<Course>>(
    `api/Course/get-All-Course?pageNumber=${pageNumber}&PageSize=${pageSize}`
  );
}

 add(course: CourseDTO) {

  const courseFormData = getCourseFormData(course);

  return this.http.post<Course>('api/Course/add-Course' ,courseFormData );
 }

 update(courseId:number,course: CourseDTO2) {

  const courseFormData = getCourseFormData2(course);

  return this.http.put<Course>(`api/Course/updateCourse/${courseId}` ,courseFormData );
 }

 delete(courseId:number) {
  return this.http.delete(`api/Course/${courseId}`);
 }

 toggleCourseAccess(courseId:number, isFree:boolean) {
  return this.http.put(`api/Course/updateCourseAccess/${courseId}`,{isFree:!isFree});
 }

 getCoursesNonPaginated():Observable<(null|Course[])> {

  return this.http.get<{data:(null|Course[])}>('api/Course/All-Courses').pipe(
    map(({data})=>data),
  );

  }

}
