import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { StudentCourseService } from '../Services/student-course.service';
import { filter } from 'rxjs';
import { IGetStudentCourse } from '../models/studentCourse/iget-student-course';

export const studentCourseResolver: ResolveFn<(IGetStudentCourse[]|null)> = (route, state) => {
  const studentCourseService = inject(StudentCourseService);

  return studentCourseService.getUserCourses().pipe(filter((c)=>c!== undefined ));
};
