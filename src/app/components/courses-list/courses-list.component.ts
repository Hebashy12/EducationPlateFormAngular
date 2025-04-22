import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course, CourseService } from '../../Services/course.service';

@Component({
  selector: 'app-courses-list',
  imports: [CommonModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css'
})
export class CoursesListComponent implements OnInit {
protected  pageNumber = 1;
protected  pageSize = 6;
  protected  totalPages = 0;
  protected  pages: number[] = [];

   private readonly course = inject(CourseService);

  protected  courses:Course[]|null = null;
  private readonly router = inject(Router);

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

  }

  addCourse() {
    this.router.navigate(['/courses/add']);
  }
  updateCourse(id: number) {
    this.router.navigate(['/courses/update', id]);
  }

  deleteCourse(id: number) {
    this.course.delete(id).subscribe({
      next: () => {

         this.courses = this.courses?.filter(course => course.courseId !== id)??this.courses ;
        console.log('Course deleted successfully');
      }
      , error: (error) => {
        console.log('Error deleting course', error);
      }
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['/courses/details', id]);
  }
  toggleFree(courseId:number, isFree:boolean) {

    this.course.toggleCourseAccess(courseId,isFree).subscribe({
      next: (data) => {

        this.courses = this.courses?.map(course => {
          if (course.courseId === courseId) {
            return { ...course, isFree: !isFree };
          }
          return course;
        }) || null;

        console.log("course updated successfully", data)
      },
      error: (error) => {
        console.log("error while updating the course", error)
      }
    })
  }

}
