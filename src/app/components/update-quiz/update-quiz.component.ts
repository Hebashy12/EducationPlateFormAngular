import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { QuizeService } from '../../services/quiz.service';
import { QuestionsService } from '../../services/questions.service';
import { Question,Quiz } from '../add-quiz/add-quiz.component';
import { ChangeDetectorRef } from '@angular/core';


export type QuizForm = {
  title: FormControl<string | null>;
  passingScore: FormControl<number | null>;
};

export type QuestionForm = {
  header: FormControl<string>;
  order: FormControl<number>;
  correctAnswer: FormControl<boolean>;
};

@Component({
  selector: 'app-update-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-quiz.component.html',
  styleUrls: ['./update-quiz.component.css'],
})
export class UpdateQuizComponent implements OnInit {
  private quizService = inject(QuizeService);
  private questionService = inject(QuestionsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);
  quizId!: number;
  quiz!: Quiz;
  questions: Question[] = [];
  idx = -1; // current question index

  quizSaved = false;
  loadingQuiz = false;
  loadingQuestion = false;

  // ——— Quiz update form ———
  quizForm = new FormGroup<QuizForm>({
    title: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    passingScore: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
  });

  // ——— Single question update form ———
  questionForm = new FormGroup<QuestionForm>({
    header: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    correctAnswer: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    order: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  currentQuestionNumber: number =0;

  ngOnInit() {
    // make sure your route is defined like `/quizzes/:quizId/edit`
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.quizService.getQuizWithQuestionsById(this.quizId).subscribe({
      next: (q) => {
        if (!q) {
          this.router.navigate(['/notFound']);
          return;
        }

        this.quiz = q;
        this.questions = q.questions;

        // patch quiz form
        this.quizForm.patchValue({
          title: q.title,
          passingScore: q.passingScore,
        });
      },
      error: () => this.router.navigate(['/notFound']),
    });
  }

  // ——— Quiz Submit ———
  onSubmitQuiz() {
    if (this.quizForm.invalid) return;
    this.loadingQuiz = true;

    console.log('Quiz form', this.quizForm.value);
    const { title, passingScore } = this.quizForm.value;
    if (!title || !passingScore) return;
    console.log('Quiz form', { title, passingScore });
    this.quizService
      .update(this.quizId, { title: title, passingScore: passingScore })
      .subscribe({
        next: () => {
          console.log('Quiz updated successfully');
          this.loadingQuiz = false;
          this.quizSaved = true;
          // this.idx = 0;
          // this.patchCurrentQuestion();

          this.questionService
            .getAllQuestionsByQuizId(this.quizId) // ← new call
            .subscribe({
              next: (qs) => {
            console.log('Questions', qs);
                this.questions = qs; // populate your array
                this.idx = 0;
                this.currentQuestionNumber = 1;
                this.patchCurrentQuestion(); // show the first question
              },
              error: (err) => {
                console.error('Failed to load questions', err);
                // you might still set quizSaved=true so the UI shows an error or empty state
              },
            });
        },
        error: () => (this.loadingQuiz = false),
      });
  }
  onSkipQuestion() {
    // advance index
    console.log('Skip question', this.idx);
 this.advance();
  }
  // ——— Question Submit ———
  onSubmitQuestion() {
    if (this.questionForm.invalid) return;
    this.loadingQuestion = true;

    const { header, correctAnswer, order } = this.questionForm.value;
    const current = this.questions[this.idx];

    if (!header || !correctAnswer || !order){
      console.error('Invalid question form', { header, correctAnswer, order });
      this.loadingQuestion = false;
      return;}
    console.log('Question form', { header, correctAnswer, order });
    const dto = { header, correctAnswer, order };

    this.questionService.update(this.questions[this.idx].id,dto ).subscribe({
      next: () => {
        console.log('Question updated successfully');

        this.loadingQuestion = false;
      //   current.header = header;
      // current.correctAnswer = correctAnswer;
      // current.order = order;
      // then move on
      this.advance();
      },
      error: () => {this.loadingQuestion = false ;
        console.error('Failed to update question', dto);
      },
    });
  }


  private advance() {
    this.idx++;
    this.currentQuestionNumber++;
    if (this.idx < this.questions.length) {


      this.patchCurrentQuestion();
      this.cdr.detectChanges();
      this.questionForm.markAsPristine();
      this.questionForm.markAsUntouched();
    }
    // once idx ≥ length, template will hide the form & show “Done”
  }
  private patchCurrentQuestion() {
    const q = this.questions[this.idx];
    this.questionForm.patchValue({
      header: q.header,
      correctAnswer: q.correctAnswer,
      order: q.order
    });

  }

  onFinish() {
    this.router.navigate(['/courses']);
  }

  // ——— Quiz form error getters ———
  get titleError() {
    const c = this.quizForm.controls.title;
    if (c.hasError('required')) return 'Title is required';
    if (c.hasError('minlength')) return 'Min 3 chars';
    if (c.hasError('maxlength')) return 'Max 20 chars';
    return '';
  }
}
