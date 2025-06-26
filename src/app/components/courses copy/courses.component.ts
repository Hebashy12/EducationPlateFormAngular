import { Component, inject, OnInit } from '@angular/core';
import { Course, CourseService } from '../../services/course.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  imports: [CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit   {


  courses:Array<Course>|null = null;

  course = inject(CourseService);

  pageNumber = 1;
  pageSize = 9;
  totalPages = 0;
  pages: number[] = [];

  loadCourses(page: number) {
    this.course.getCoursesPaginated(page, this.pageSize).subscribe(res => {
      this.courses = res.data;
      this.pageNumber = res.pageNumber;
      this.totalPages = res.totalPages;
      this.pages = Array.from({ length: res.totalPages }, (_, i) => i + 1);
    });
  }

  ngOnInit(): void {
    this.loadCourses(this.pageNumber);
    // this.course.getCoursesPaginated(this.pageNumber, this.pageSize).subscribe({
    //   next: ({data}) => {
    //     this.courses = data;
    //     console.log(data);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }
    // });
  }

}
