// course.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Course , CourseService } from '../services/course.service';
import { filter } from 'rxjs';

export const coursesResolver: ResolveFn<(null|Course[])> = (route,state) => {
  const courseService = inject(CourseService);

  return courseService.getCoursesNonPaginated().pipe(filter((c)=>c!== undefined ));
};
