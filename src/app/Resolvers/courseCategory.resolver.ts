import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { CategoryService } from '../services/category.service';
import { Category } from '../components/update-course/update-course.component';
import { filter } from 'rxjs';

export const courseCategoryResolver: ResolveFn<(null|Category)> = (route,state) => {
  const categoryService = inject(CategoryService);
  const id = route.params['id'] ;
  return categoryService.getCategortByCourseId(id).pipe(filter((c)=>c!== undefined ));
};
