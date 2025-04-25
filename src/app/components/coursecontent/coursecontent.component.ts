import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../Services/video.service';
import { QuizeService } from '../../Services/quiz.service';
import { IGetVideo } from '../../models/videoModel/iget-video';
import { IGetQuizWithQuestions } from '../../models/quize/iget-quiz-with-questions';
import { Course } from '../../Services/course.service';
import { IGetSection } from '../../models/sectionModel/iget-section';
import { IGetQuiz } from '../../models/quize/iget-quiz';

@Component({
  selector: 'app-coursecontent',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './coursecontent.component.html',
  styleUrls: ['./coursecontent.component.css']
})
export class CoursecontentComponent implements OnInit {
  sections: IGetSection[] = [];
  isCollapsed = true;

  // Progress-related
  progress = 0;
  circumference = 2 * Math.PI * 16;
  totalQuizzes = 0;
  passedQuizzes = 0;

  videosLst: IGetVideo[] | null = [];
  currentVideo: string | undefined = '';
  selectedSectionId!: number;
  showQuest: boolean = false;
  userAnswers: boolean[] = [];

  initSelected!: number;
  quizWithQestion!: IGetQuizWithQuestions;

  videoSer = inject(VideoService);
  quizSer = inject(QuizeService);
  course:Course;

  constructor(private router: Router,
    private readonly route: ActivatedRoute) {
    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation?.extras.state;
    // if (state) {
    //   this.sections = state['sections'] || [];
    //   this.initSelected = this.sections[0]?.sectionId;
    // }
    this.sections = this.route.snapshot.data['sections'] ?? null;
    this.course = this.route.snapshot.data['course'] ?? null;

  }

  ngOnInit(): void {
    if (this.sections!=null) {
      this.initSelected = this.sections[0]?.sectionId;
    }
    if (this.sections.length === 0) {
      console.log('No course content available.');
    } else {
      this.getVideos(this.initSelected);
      this.updateProgress();
    }
    this.sections.forEach((S)=>{
    (this.getQuizWithQuestion(S.sectionId))
    })
  }
quizs:IGetQuiz[]=[]
  getVideos(sectionId: number) {
    this.videoSer.getVideoBySectionId(sectionId).subscribe({
      next: (v) => {
        this.videosLst = v;
        if (this.videosLst?.length !== 0)
          this.currentVideo = this.videosLst![0].videoFileUrl;
      },
      error: (e) => {
        console.log(`Video API error: ${e}`);
      }
    });
  }

  getQuizWithQuestion(quizId: number) {
    this.quizSer.getQuizQustions(quizId).subscribe({
      next: (q) => {
        this.quizWithQestion = q;
        // if(q.id!=null)
          this.quizs!.push(q)
      },
      error: (e) => {
        console.log(`Quiz API error: ${e}`);
      }
    });
  }

  toggleSection(sectionId: number): void {
    this.videosLst = [];
    this.showQuest = false;
    this.quizWithQestion={title:'',questions:null, id:0, userQuizzes:[], section:null, numOfQuestion:0, sectionId:0,passingScore:0 }
    this.selectedSectionId = sectionId;
    this.getVideos(sectionId);
    this.getQuizWithQuestion(sectionId);
  }

  isSectionVisible(sectionId: number): boolean {
    return this.sections.find(s => s.sectionId == sectionId)?.isPassSection || false;
  }

  showVideo(videoId: number) {
    this.currentVideo = this.videosLst?.find(v => v.videoId == videoId)?.videoFileUrl;
    this.showQuest = false;
  }

  showQuestions() {
    this.currentVideo = '';
    this.showQuest = true;
  }

  score: number | null = null;

  submitAnswers() {
    let correctCount = 0;

    this.quizWithQestion.questions!.forEach((question, index) => {
      if (this.userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    this.score = Math.round((correctCount / this.quizWithQestion.questions!.length) * 100);

    // Mark quiz as passed if score >= 60%
    if (this.score >= 60) {
      const sectionIndex = this.sections.findIndex(s => s.sectionId === this.selectedSectionId);
      if (sectionIndex !== -1) {
        this.sections[sectionIndex].isPassSection = true;
        this.updateProgress();
      }
    }
  }

  updateProgress() {

    this.totalQuizzes=0
    this.sections.forEach(section => {

        this.totalQuizzes= this.quizs.length;
        if (section.isPassSection) {
          if(this.passedQuizzes/this.totalQuizzes<=1)
          this.passedQuizzes++;
        }

    });

    this.progress = this.totalQuizzes > 0
      ? Math.round((this.passedQuizzes / this.totalQuizzes) * 100)
      : 0;
  }

  formatDuration(duration: number): string {
    const parts = duration.toString().split(':');
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2].split('.')[0], 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  sectionDurations: { [sectionId: number]: string } = {};

  getSectionTotalDuration(sectionId: number): string {
    if (this.sectionDurations[sectionId]) {
      return this.sectionDurations[sectionId]; // Return cached value if available
    }

    // Start with placeholder
    this.sectionDurations[sectionId] = '...';

    this.videoSer.getVideoBySectionId(sectionId).subscribe({
      next: (videos) => {
        let totalSeconds = 0;

        videos!.forEach(video => {
          const parts = video.videoDuration.toString().split(':');
          const hours = parseInt(parts[0], 10);
          const minutes = parseInt(parts[1], 10);
          const seconds = parseInt(parts[2].split('.')[0], 10);

          totalSeconds += hours * 3600 + minutes * 60 + seconds;
        });

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        const durationStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        this.sectionDurations[sectionId] = durationStr;
      },
      error: (e) => {
        console.log(`Error calculating section duration: ${e}`);
        this.sectionDurations[sectionId] = '00:00:00';
      }
    });

    return this.sectionDurations[sectionId]; // This will show '...' initially then update when ready
  }

  goToAIAssistant(): void {
    this.router.navigate(['/courses/chat-bot']);
  }
}
