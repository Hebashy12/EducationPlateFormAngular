import { Component, Input } from '@angular/core';
import { Course , CourseService } from '../../Services/course.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-course-details',
  imports: [CurrencyPipe,CommonModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent {
 // @Input()
 course: Course|null= null;
  courseId: number = 0;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService
  ) {
    this.course = this.route.snapshot.data['course']?.data ?? null;
  }

  ngOnInit(): void {

    // this.route.paramMap.subscribe((params) => {
    //   this.courseId = +params.get('id')!;
    //   this.getCourseDetails(this.courseId);
    // });

    //this.getCourseDetails(this.route.snapshot.params['id']);

  }

  getCourseDetails(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: ({data}) => {
        console.log(data)
        this.course = data;

      },
      error: (err) => {
        this.router.navigate(['/notFound']);
      console.log("error fetching course",err);
      },
    });
  }

}
