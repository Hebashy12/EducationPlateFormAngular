import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IGetSection } from '../../models/sectionModel/iget-section';
import { IGetVideo } from '../../models/videoModel/iget-video';
import { Course } from '../../Services/course.service';
import { Category } from '../add-course/add-course.component';
import { VideoService } from '../../Services/video.service';
import { SectionService } from '../../Services/section.service';
import { QuizeService } from '../../Services/quiz.service';


import { AuthService } from '../../Services/auth.service';
import { PaymentService } from '../../Services/payment.service';
import { IGetStudentCourse } from '../../models/studentCourse/iget-student-course';

@Component({
  selector: 'app-coursepage',
  imports: [CommonModule, RouterModule, DatePipe,RouterLink],

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
  studentCouse!:IGetStudentCourse[];
  isBuyed:boolean=false;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly videoService: VideoService,
    private authService: AuthService
  ) {
    this.course = this.route.snapshot.data['course'] ?? null;
    this.studentCouse = this.route.snapshot.data['studentCourse'] ?? null;
    this.studentCouse.forEach(element => {
      if(element.coursesId===this.course?.courseId)
        this.isBuyed=true;
    });
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    if (state) {
      this.category = state['categories'] || null;
    }
    // this.category = this.route.snapshot.data['category'] ?? null;
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
  goToCouseContent(){
    this.router.navigate(['courses','courseContent', this.course?.courseId]);
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
    this.router.navigate(['courses/card'], { //'courses/courseContent'
      state: { sections: this.sections }
    });
  }

  formatDuration(duration: number): string {
    const parts = duration.toString().split(':');
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2].split('.')[0], 10);

    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');

    return `${mm}:${ss}`;
  }

  sectionDurations: { [sectionId: number]: string } = {};
  getSectionTotalDuration(sectionId: number): string {
    if (this.sectionDurations[sectionId]) {
      return this.sectionDurations[sectionId]; // Return cached value
    }

    // Temporary loading indicator
    this.sectionDurations[sectionId] = '...';

    this.videoService.getVideoBySectionId(sectionId).subscribe({
      next: (videos) => {
        let totalSeconds = 0;

        videos!.forEach(video => {
          const parts = video.videoDuration.toString().split(':'); // format: HH:mm:ss
          const hours = parseInt(parts[0], 10);
          const minutes = parseInt(parts[1], 10);
          const seconds = parseInt(parts[2].split('.')[0], 10);

          totalSeconds += hours * 3600 + minutes * 60 + seconds;
        });

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        this.sectionDurations[sectionId] = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      },
      error: (err) => {
        console.error(`Error fetching duration for section ${sectionId}: ${err}`);
        this.sectionDurations[sectionId] = '00:00:00';
      }
    });

    return this.sectionDurations[sectionId]; // Initial value will be '...'
  }

}
