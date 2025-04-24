import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IGetVideo } from '../../models/videoModel/iget-video';
import { VideoService } from '../../Services/video.service';
import { IGetQuiz } from '../../models/quize/iget-quiz';
import { QuizeService } from '../../Services/quiz.service';
import { IGetQuizWithQuestions } from '../../models/quize/iget-quiz-with-questions';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-coursecontent',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
      console.log(this.sections);
      this.initSelected=this.sections[0].sectionId

    }
  }

  // Fetch API
  videosLst:IGetVideo[]|null=[];
  videoSer=inject(VideoService);
  sectionQuiz:IGetQuiz|null=null;
  quizSer=inject(QuizeService);
  quizWithQestion!:IGetQuizWithQuestions
  // getVideos(sectionId:number){
  //   this.videoSer.getVideoBySectionId(sectionId).subscribe({
  //     next:(video)=>{
  //       this.videosLst=video;
  //     },
  //     error:(e)=>{
  //       console.log(`We have some Problem when Fetching Video API: `+e);
  //     }
  //   })
  // }


  getVideos(id:number){
    this.videoSer.getVideoBySectionId(id).subscribe({
      next:(v)=>{
        this.videosLst=v;
      },
      error:(e)=>{
        console.log(`We have Problems when fetch Video API ${e}`);
      }
    })
  }


  // getQuiz(sectionId:number){
  //   this.quizSer.getQuizBySectionId(sectionId).subscribe({
  //     next:(quiz)=>{
  //       this.sectionQuiz=quiz
  //     },
  //     error:(e)=>{
  //       console.log(`We have some Problems when Fetching API: ${e}`);
  //     }
  //   })
  // }
  getQuizWithQuestion(quizId:number){
    this.quizSer.getQuizQustions(quizId).subscribe({
      next:(q)=>{
        this.quizWithQestion=q;
      },
      error:(e)=>{
        console.log(`We have some Problems when Fetching API: ${e}`)
      }
    })
  }
initSelected!:number
  ngOnInit(): void {
    if (this.sections.length === 0) {
      console.log('No course content available.');
    }else{

      console.log("sectionId Init: "+this.initSelected)
      this.videoSer.getVideoBySectionId(this.initSelected).subscribe({
      next:(v)=>{
        this.videosLst=v;
        if(this.videosLst?.length!==0)
          this.currentVideo=this.videosLst![0].videoFileUrl
      }})
      console.log(this.videosLst)
    }
  }
selectedSectionId!:number
  toggleSection(sectionId: number): void {
    console.log(sectionId);
    this.videosLst=[];
    this.selectedSectionId=sectionId
    this.getVideos(sectionId);
    console.log(this.videosLst)
    this.getQuizWithQuestion(sectionId);
    // this.sections[index].isVisible = !this.sections[index].isVisible;
  }
// videoLst:IGetVideo|null=null;
  isSectionVisible(sectionId: number): boolean {

    return this.sections.find((s)=>s.sectionId==sectionId).isPassSection || false;
    // return true;
  }
currentVideo:string|undefined='';
  showVideo(id:number){
    this.currentVideo=this.videosLst?.find((v)=>v.videoId==id)?.videoFileUrl
    this.showQuest=false;
    console.log(this.currentVideo);
  }
  showQuest:boolean=false;
  showQuestions(){
    this.currentVideo=''
    // this.videosLst=[];
    console.log(this.quizWithQestion.questions)
    this.showQuest=!this.showQuest
  }


  userAnswers: boolean[] = [];

  submitAnswers() {
    let correctCount = 0;

    this.quizWithQestion.questions!.forEach((question, index) => {
      if (this.userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / this.quizWithQestion.questions!.length) * 100;
    alert(`Your Score: ${score}%`);
  }


  // getSectionLength(section: any): string {
  //   // let totalSeconds = 0;
  //   // section.videos.forEach((video: any) => {
  //   //   const parts = video.time.split(':').map((v: string) => parseInt(v, 10));
  //   //   if (parts.length === 2) {
  //   //     totalSeconds += parts[0] * 60 + parts[1];
  //   //   } else {
  //   //     totalSeconds += parts[0] * 60;
  //   //   }
  //   });
  //   const minutes = Math.floor(totalSeconds / 60);
  //   return `${minutes}min`;
  // }
}
