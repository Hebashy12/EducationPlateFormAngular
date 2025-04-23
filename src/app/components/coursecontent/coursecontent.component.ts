import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IGetVideo } from '../../models/videoModel/iget-video';
import { VideoService } from '../../Services/video.service';
import { IGetQuiz } from '../../models/quize/iget-quiz';
import { QuizeService } from '../../Services/quiz.service';
import { IGetQuizWithQuestions } from '../../models/quize/iget-quiz-with-questions';

@Component({
  selector: 'app-coursecontent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './coursecontent.component.html',
  styleUrls: ['./coursecontent.component.css']
})
export class CoursecontentComponent implements OnInit {
  sections: any[] = [];
  isCollapsed = true;
  progress = 20;
  circumference = 2 * Math.PI * 16;


  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    if (state) {
      this.sections = state['sections'] || [];
    }
  }

  // Fetch API
  videosLst:IGetVideo[]|null=[];
  videoSer=inject(VideoService);
  sectionQuiz:IGetQuiz|null=null;
  quizSer=inject(QuizeService);
  quizWithQestionLst:IGetQuizWithQuestions[]=[]
  getVideos(sectionId:number){
    this.videoSer.getVideoBySectionId(sectionId).subscribe({
      next:(video)=>{
        this.videosLst=video;
      },
      error:(e)=>{
        console.log(`We have some Problem when Fetching Video API: `+e);
      }
    })
  }

  getQuiz(sectionId:number){
    this.quizSer.getQuizBySectionId(sectionId).subscribe({
      next:(quiz)=>{
        this.sectionQuiz=quiz
      },
      error:(e)=>{
        console.log(`We have some Problems when Fetching API: ${e}`);
      }
    })
  }
  getQuizWithQuestion(quizId:number){
    this.quizSer.getQuizQustions(quizId).subscribe({
      next:(q)=>{
        this.quizWithQestionLst=q;
      },
      error:(e)=>{
        console.log(`We have some Problems when Fetching API: ${e}`)
      }
    })
  }

  ngOnInit(): void {
    if (this.sections.length === 0) {
      console.log('No course content available.');
    }
  }

  toggleSection(index: number): void {
    this.sections[index].isVisible = !this.sections[index].isVisible;
  }

  isSectionVisible(index: number): boolean {
    return this.sections[index]?.isVisible || false;
  }

  getSectionLength(section: any): string {
    let totalSeconds = 0;
    section.videos.forEach((video: any) => {
      const parts = video.time.split(':').map((v: string) => parseInt(v, 10));
      if (parts.length === 2) {
        totalSeconds += parts[0] * 60 + parts[1];
      } else {
        totalSeconds += parts[0] * 60;
      }
    });
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}min`;
  }
}
