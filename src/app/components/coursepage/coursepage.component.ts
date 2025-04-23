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

@Component({
  selector: 'app-coursepage',
  imports: [CommonModule, RouterModule,DatePipe],
  templateUrl: './coursepage.component.html',
  styleUrls: ['./coursepage.component.css']
})
export class CoursepageComponent implements OnInit {

  course: Course | null = null;
  category: Category | null = null;
  sections: IGetSection[] | null = null;
  videos: IGetVideo[] | null = null;

  // Array to hold the visibility state of each section
  visibleSections: boolean[] = [];

  constructor(private readonly router: Router
    , private readonly route: ActivatedRoute
    , private readonly videoService: VideoService) {
    this.course = this.route.snapshot.data['course']??null
    if(this.course?.lastUpdateOn===null){
      this.course.lastUpdateOn= new Date().toDateString();
    }
    console.log(this.course);
    this.category = this.route.snapshot.data['category']??null
    console.log(this.category);
    this.sections = this.route.snapshot.data['sections']??null
    console.log(this.sections);

   // this.getAllSectionByCourseIdFromAPI(this.route.snapshot.params['id']);

    const nav = this.router.getCurrentNavigation();
    // Get course and category from state
    // this.course = nav?.extras.state?.['course'];
    // this.category = nav?.extras.state?.['categories'];

  }

  // sectionSer=inject(SectionService);
  // quizSer=inject(QuizeService)
  // allSectionInCourse:IGetSection[]=[];
  // sectionsWithVideo:IGetVideo[]=[];

  // getAllSectionByCourseIdFromAPI(id:number){
  //   this.sectionSer.getSections(id).subscribe({
  //     next:(s)=>{
  //       this.allSectionInCourse=s;
  //       this.allSectionInCourse.forEach(s=>console.log(s))
  //     },
  //     error:(e)=>{
  //       console.log("we have some Problem when Fetch Category API "+e)
  //     }
  // })
  // }
videoLst:IGetVideo[]|null=null;
filteredVideoLst:IGetVideo[]|null=[]
  ngOnInit(): void {
    // Initialize visibility state of sections
    // if (this.sections) {
    //   this.visibleSections = Array(this.course.sections.length).fill(false);
    // }


  }

getAllVideoes(id:number){
  this.videoService.getVideoBySectionId(id).subscribe({
    next:(v)=>{
      this.videoLst=v;
    },
    error:(e)=>{
      console.log(`We have Problems when fetch Video API ${e}`);
    }
  })
}

  // Method to toggle section visibility
  toggleSection(id: number): void {
    //this.visibleSections[index] = !this.visibleSections[index];
    // this.videoService.getVideosBySectionId(id).subscribe({
    //   next: (videos) => {
    //     this.videos = videos.data;
    //     this.sectionsWithVideo = videos.data;
    //     console.log(this.videos);
    //   }
    //   , error: (error) => {}
    this.videoLst=[];
    this.getAllVideoes(id)
  }

  // Method to check if a section is visible
  isSectionVisible(index: number): boolean {
    return this.visibleSections[index];
  }

  // Get the total number of lectures across all sections
  getTotalLectures(): number {
    return this.sections!.reduce((count: number, section: IGetSection) => {
      return count + section.videosNum;
    }, 0);
  }

  // Get the total duration of all videos in hours and minutes
  // getTotalLength(): string {
  //   let totalSeconds = 0;
  //   this.sections?.forEach((section: IGetSection) => {
  //     section.videos.forEach((video: any) => {
  //       const [min, sec] = video.time.split(':').map((v: string) => parseInt(v, 10));
  //       totalSeconds += min * 60 + sec;
  //     });
  //   });
    // const hours = Math.floor(totalSeconds / 3600);
    // const minutes = Math.floor((totalSeconds % 3600) / 60);
    // return `${hours}h ${minutes}m`;
  //}

  // Navigate to the CourseContentComponent with course sections data
  navigateToCourseContent(): void {
    this.router.navigate(['courses/courseContent'], {
      state: { sections: this.sections }
    });
  }
}
