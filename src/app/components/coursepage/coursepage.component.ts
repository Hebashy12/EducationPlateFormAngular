import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-coursepage',
  imports: [CommonModule],
  templateUrl: './coursepage.component.html',
  styleUrl: './coursepage.component.css'
})
export class CoursepageComponent {
 

  course: any;
  category: any;

  constructor(private router: Router, private route: ActivatedRoute) {
    const nav = this.router.getCurrentNavigation();
    this.course = nav?.extras.state?.['course'];
    this.category = nav?.extras.state?.['categories'];
  }

  visibleSections: boolean[] = [];

ngOnInit() {
  if (this.course?.sections) {
    this.visibleSections = Array(this.course.sections.length).fill(false);
  }
}

toggleSection(index: number) {
  this.visibleSections[index] = !this.visibleSections[index];
}

isSectionVisible(index: number): boolean {
  return this.visibleSections[index];
}

getTotalLectures(): number {
  return this.course.sections.reduce((count: number, section: any) => {
    return count + section.videos.length;
  }, 0);
}

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

}

