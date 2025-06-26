import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizeService } from '../../services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Section } from '../update-video/update-video.component';
import { QuestionsService } from '../../services/questions.service';
 export type QuizForm = {
  title: FormControl<string | null>;
  passingScore: FormControl<number | null>;
  sectionId: FormControl<number | null>;
};

export type QuestionForm = {
  header: FormControl<string | null>;
  order: FormControl<number | null>;
  correctAnswer: FormControl<boolean | null>;

};
export type QuizDTO = {
  title: string;
  passingScore: number;
  sectionId: number;
};

export type Quiz = {
  id: number;
  title : string;
  passingScore: number;
  sectionId: number;
  numOfQuestion: number;
  questions: Question[],
  section?: null|Section;
  userQuizzes?: any[]
}

export type QuestionDTO = {
  header: string;
  order: number;
  correctAnswer: boolean;
  quizId: number;
};

export type Question = {
  id: number;
  header: string;
  order: number;
  correctAnswer: boolean;
  quizId: number;
  quiz?: Quiz | null;
};

@Component({
  selector: 'app-add-quiz',
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.css'
})
export class AddQuizComponent implements OnInit {

  titleFocused = false;
  passingScoreFocused = false;
  sectionFocused = false;

  onFinishQuiz() {

    this.router.navigate(['/courses']); // 👈 Change path to your desired route
  }


private readonly quizService = inject(QuizeService) ;
private readonly questionService = inject(QuestionsService) ;
private readonly route = inject(ActivatedRoute);
private readonly router = inject(Router);

protected sections: Section[]|null = null;
  protected quiz: Quiz | null = null;
  protected quizId: number | null = null;
 protected currentQuestionNumber:number = 1;

 //@ViewChild('form') quizFormElement!: FormGroupDirective;
 quizCreated = false;
  questionForm = new FormGroup<QuestionForm>({
    header: new FormControl<string | null>("", [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
    order: new FormControl<number | null>(this.currentQuestionNumber, [Validators.required]),
    correctAnswer: new FormControl<boolean | null>(false, [Validators.required]),
  });


  submitQuestion() {
    if (!this.quizId || this.questionForm.invalid) return;

    const {correctAnswer,header,order} = this.questionForm.value

   if(correctAnswer!==null && correctAnswer!==undefined&& header && order && this.quizId) {
    const dto: QuestionDTO = {correctAnswer,header,order,quizId: this.quizId};

    this.questionService.add(dto).subscribe({
      next: () => {
        console.log('Question added successfully');

        this.currentQuestionNumber++;

        this.questionForm.reset({
          header: '',
          correctAnswer: false,
          order: this.currentQuestionNumber
        });
        this.questionForm.markAsPristine();
        this.questionForm.markAsUntouched();

      },
      error: (err) => console.error('Question failed', err)
    });
  }
  }

  ngOnInit(): void {
this.quizService.getSectionsByCourseId(this.route.snapshot.params['courseId']).subscribe({
  next: (data) => {
    if (!data) {
      this.router.navigate(['/notFound']);
      return;
    }
    this.sections = data.filter((s)=>s.quizId == null).sort((a, b) => a.sectionName.localeCompare(b.sectionName));
    console.log(this.sections);
  },
  error: (error) => {
    console.log('Error while getting sections', error);
    this.router.navigate(['/notFound']);
  }

  });
  }

  protected readonly QuizForm = new FormGroup<QuizForm>({
    title: new FormControl<string | null>(null,[ Validators.required, Validators.minLength(3), Validators.minLength(10), Validators.maxLength(20)]),
    passingScore: new FormControl<number | null>(null ,[Validators.required, Validators.min(0)]),
    sectionId: new FormControl<number | null>(null ,[Validators.required]),
  });
  onSubmit() {
    if (this.QuizForm.invalid) {
      console.log("invalid form data");
      return;
    }
    if (this.QuizForm.valid) {
      console.log("valid form data");
      const { title, passingScore, sectionId } = this.QuizForm.value;
      if (title && passingScore && sectionId) {
        const quiz: QuizDTO = { title, passingScore, sectionId };
        console.log(quiz);
        this.loading = true;
        this.quizService.add(quiz).subscribe({
          next: (res) => {
            console.log('Quiz created', res);
            this.quiz = res;
            this.quizId = res.id;

            this.QuizForm.reset();
            this.quizCreated = true;

            this.loading = false;

          },
          error: (err) => {
            console.error('Error creating quiz', err);
            this.loading = false;
          }
        });
      }
    }
  }

  loading = false;





  get titleError() {
    const control = this.QuizForm.controls.title;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Title is required';
    }
    else if (control?.hasError('minlength')) {
      return 'Title must be at least 10 characters long';
    } else if (control?.hasError('maxlength')) {
      return 'Title cannot be more than 20 characters long';
    }
    return '';
  }

  get passingScoreError() {
    const control = this.QuizForm.controls.passingScore;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Passing Score is required';
    } else if (control?.hasError('min')) {
      return 'Passing Score must be at least 0';
    }
    return '';
  }

  get sectionError() {
    const control = this.QuizForm.controls.sectionId;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Section is required';
    }
    return '';
  }

}
