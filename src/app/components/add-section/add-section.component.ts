import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SectionService } from '../../Services/section.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../Services/course.service';

export type SectionDTO = {
  sectionName: string;
  isPassSection: boolean;
  courseId: number;
};

export type SectionForm = {
  sectionName: FormControl<string | null>;
  isPassSection: FormControl<boolean | null>;
  courseId: FormControl<number | null>;
};
@Component({
  selector: 'app-add-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-section.component.html',
  styleUrl: './add-section.component.css'
})
export class AddSectionComponent implements OnInit{

  sectionNameFocused = false;
courseFocused = false;


  courses: Course[]|null = null;
  constructor(private sectionService: SectionService , private router:Router, private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.sectionService.getAllCourses().subscribe({
      next: ({data}) => {
        if (!data) {
          this.router.navigate(['/notFound']);
          return;
        }
        this.courses = data.sort((a, b) => a.courseId-b.courseId); // Sort by courseId
        //.sort((a, b) => a.title.localeCompare(b.title));
      },
      error: (error) => {
        console.log('Error while getting courses', error);
        this.router.navigate(['/notFound']);
      },
    });
  }

  protected readonly SectionForm = new FormGroup<SectionForm>({
    sectionName: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    isPassSection: new FormControl<boolean>(false, Validators.nullValidator),
    courseId: new FormControl<number | null>(null,[Validators.required,Validators.min(1)]),
  });

  onSubmit(): void {
    if (this.SectionForm.invalid) {
      console.log('Invalid form data');
      return;
    }

    const { sectionName, isPassSection, courseId } = this.SectionForm.value;
    if (sectionName && isPassSection !== null &&isPassSection!==undefined && courseId ) {
      const section: SectionDTO = { sectionName, isPassSection, courseId };

      this.sectionService.add(section).subscribe({
        next: (data) => {
          console.log('Section added successfully', data);
          this.SectionForm.reset(); // Reset and set default
        },
        error: (err) => console.log('Error while adding section', err),
      });
    }
  }

  get sectionNameError(): string {
    const control = this.SectionForm.controls.sectionName;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Section name is required';
    } else if (control?.hasError('minlength')) {
      return 'Section name must be at least 3 characters long';
    } else if (control?.hasError('maxlength')) {
      return 'Section name cannot be more than 30 characters long';
    }
    return '';
  }

  get courseIdError(): string {
    const control = this.SectionForm.controls.courseId;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Course ID is required';
    }
    else if (control?.hasError('min')) {
      return 'Course ID must be greater than 0';
    }
    return '';
  }
}

