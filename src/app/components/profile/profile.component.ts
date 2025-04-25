import { Component } from '@angular/core';
import { IGetStudentCourse } from '../../models/studentCourse/iget-student-course';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

constructor( private readonly route: ActivatedRoute, private readonly router:Router){
this.userCourses=this.route.snapshot.data['studentCourse'] ?? null;
console.log("ppp"+this.userCourses);
}

  userCourses:IGetStudentCourse[]|null;

  goToCourse(id:number){
    this.router.navigateByUrl(`courses/courseContent/${id}`)
  }
}
