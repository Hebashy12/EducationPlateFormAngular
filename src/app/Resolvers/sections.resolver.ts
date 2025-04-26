import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { IGetSection } from '../models/sectionModel/iget-section';
import { SectionService } from '../Services/section.service';
import { filter } from 'rxjs';

export const sectionsResolver: ResolveFn<(null|IGetSection[])> = (route,state) => {
  const sectionService = inject(SectionService);
  const id = route.params['id'] ;
  return sectionService.getSections(id).pipe(filter((c)=>c!== undefined ));


};
