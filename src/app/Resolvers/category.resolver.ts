// course.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Course , CourseService } from '../services/course.service';
import { Category } from '../components/add-course/add-course.component';
import { filter } from 'rxjs';

export const categoryResolver: ResolveFn<Category[]> = (route,state) => {
  const courseService = inject(CourseService);

  return courseService.getAllCategories().pipe(filter((c)=>c!== undefined ));
};
