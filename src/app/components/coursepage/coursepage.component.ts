import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IGetSection } from '../../models/sectionModel/iget-section';
import { IGetVideo } from '../../models/videoModel/iget-video';
import { Course } from '../../Services/course.service';
import { Category } from '../add-course/add-course.component';
import { VideoService } from '../../Services/video.service';
import { SectionService } from '../../Services/section.service';
import { QuizeService } from '../../Services/quiz.service';
import { PaymentService } from '../../Services/payment.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-coursepage',
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './coursepage.component.html',
  styleUrls: ['./coursepage.component.css']
})
export class CoursepageComponent implements OnInit {
  course: Course | null = null;
  category: Category | null = null;
  sections: IGetSection[] | null = null;
  videoLst: IGetVideo[] | null = null;
  // Array to manage the visibility of each section independently
  visibleSections: boolean[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly videoService: VideoService,
    private authService: AuthService
  ) {
    this.course = this.route.snapshot.data['course'] ?? null;
    this.category = this.route.snapshot.data['category'] ?? null;
    this.sections = this.route.snapshot.data['sections'] ?? null;

    // Initialize visibility state for each section to false (collapsed by default)
    if (this.sections) {
      this.visibleSections = new Array(this.sections.length).fill(false);
    }
  }
  userId!:string
  ngOnInit(): void {
    const currentUser = this.authService.userSignal();
    if(currentUser?.id!==undefined)
    this.userId= currentUser?.id;

  console.log('Current User ID:', this.userId);
  }

  // Fetch videos for a specific section
  getAllVideoes(sectionId: number): void {
    this.videoService.getVideoBySectionId(sectionId).subscribe({
      next: (videos) => {
        this.videoLst = videos;
      },
      error: (error) => {
        console.error(`Error fetching videos: ${error}`);
      }
    });
  }

  // Toggle the visibility of a section (without affecting other sections)
  toggleSection(sectionId: number, index: number): void {
    // Toggle visibility of the clicked section
    this.visibleSections[index] = !this.visibleSections[index];

    // If the section is expanded, fetch its videos
    if (this.visibleSections[index]) {
      this.getAllVideoes(sectionId);
    } else {
      // Reset video list when the section is collapsed
      this.videoLst = null;
    }
  }


  paymentSer=inject(PaymentService)
  // Payment
  Payment(){
    if(this.course!==null)
    this.paymentSer.createCheckoutSession(this.course, this.userId).subscribe(res => {
      window.location.href = res.url;
    });
  }

  // Check if the section is visible
  isSectionVisible(index: number): boolean {
    return this.visibleSections[index];
  }

  // Get total number of lectures in the course
  getTotalLectures(): number {
    return this.sections!.reduce((total, section) => total + section.videosNum, 0);
  }

  // Navigate to the course content page
  navigateToCourseContent(): void {
    this.router.navigate(['courses/courseContent'], {
      state: { sections: this.sections }
    });
  }
}
