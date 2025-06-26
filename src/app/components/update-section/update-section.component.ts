import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SectionService } from '../../services/section.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export type SectionDTO2 = {
  sectionName: string;
  isPassSection: boolean;

};

export type SectionForm = {
  sectionName: FormControl<string | null>;
  isPassSection: FormControl<boolean | null>;

};
@Component({
  selector: 'app-update-section',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-section.component.html',
  styleUrl: './update-section.component.css'
})
export class UpdateSectionComponent {

  private readonly sectionService = inject(SectionService);
private readonly route = inject(ActivatedRoute);
private readonly router = inject(Router);

  protected readonly SectionForm = new FormGroup<SectionForm>({
    sectionName: new FormControl<string>('', [
      // Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    isPassSection: new FormControl<boolean>(false, Validators.nullValidator),

  });

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

  ngOnInit(): void {
    this.sectionService.getSectionById(this.route.snapshot.params['sectionId']).subscribe({
      next: (data) => {
        if (!data) {
          this.router.navigate(['/notFound']);
          return;
        }
        this.SectionForm.patchValue({
          sectionName: data.sectionName,
          isPassSection: data.isPassSection,
        });
      },
      error: (error) => {
        console.log('error while getting the section', error);
        this.router.navigate(['/notFound']);
      },
    });
  }
  onSubmit(): void {
    if (this.SectionForm.invalid) {
      console.log('Invalid form data');
      return;
    }
    if (this.SectionForm.valid) {
      console.log('valid form data');
      const { sectionName, isPassSection } = this.SectionForm.value;
      if (sectionName && isPassSection !== undefined&& isPassSection !== null) {
        const section: SectionDTO2 = { sectionName, isPassSection };
        console.log(section);
        this.sectionService.update(this.route.snapshot.params['sectionId'], section).subscribe({
          next: (data) => {
            this.SectionForm.reset();
            console.log('section updated successfully', data);
          },
          error: (error) => console.log('error while updating the section', error)
        });
      }
    }
  }

}
