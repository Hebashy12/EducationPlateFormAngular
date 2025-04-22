// course.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Course , CourseService } from '../Services/course.service';
import { map } from 'rxjs';

export const courseResolver: ResolveFn<(null|Course)> = (route,state) => {
  const courseService = inject(CourseService);
  const id = route.params['id'] ;
  return courseService.getCourseById(id).pipe(map(({data})=>data));
};
