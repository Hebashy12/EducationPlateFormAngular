// course.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Course , CourseService } from '../Services/course.service';

export const coursesResolver: ResolveFn<(null|Course[])> = (route,state) => {
  const courseService = inject(CourseService);

  return courseService.getCoursesNonPaginated();
};
