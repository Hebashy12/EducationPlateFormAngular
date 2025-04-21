import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-coursepage',
  imports: [CommonModule, RouterModule],
  templateUrl: './coursepage.component.html',
  styleUrls: ['./coursepage.component.css']
})
export class CoursepageComponent implements OnInit {

  course: any;
  category: any;

  // Array to hold the visibility state of each section
  visibleSections: boolean[] = [];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    // Get course and category from state
    this.course = nav?.extras.state?.['course'];
    this.category = nav?.extras.state?.['categories'];
  }

  ngOnInit(): void {
    // Initialize visibility state of sections
    if (this.course?.sections) {
      this.visibleSections = Array(this.course.sections.length).fill(false);
    }
  }

  // Method to toggle section visibility
  toggleSection(index: number): void {
    this.visibleSections[index] = !this.visibleSections[index];
  }

  // Method to check if a section is visible
  isSectionVisible(index: number): boolean {
    return this.visibleSections[index];
  }

  // Get the total number of lectures across all sections
  getTotalLectures(): number {
    return this.course.sections.reduce((count: number, section: any) => {
      return count + section.videos.length;
    }, 0);
  }

  // Get the total duration of all videos in hours and minutes
  getTotalLength(): string {
    let totalSeconds = 0;
    this.course.sections.forEach((section: any) => {
      section.videos.forEach((video: any) => {
        const [min, sec] = video.time.split(':').map((v: string) => parseInt(v, 10));
        totalSeconds += min * 60 + sec;
      });
    });
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  // Navigate to the CourseContentComponent with course sections data
  navigateToCourseContent(): void {
    this.router.navigate(['/Coursecontent'], {
      state: { sections: this.course.sections }
    });
  }
}
