import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Course } from '../../services/course.service';
import { CommonModule } from '@angular/common';

export type CategoryDTO = {
  name: string;
}
export type Category = {
  categorieId: number;
  name: string;
  courses?: Course[] | null;
  isDeleted: boolean;
  createOn: string;
  lastUpdateOn: string | null;
}
export type CategoryForm = {
  name: FormControl<string | null>;
}

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
nameFocused: any;
  constructor(private categoryService: CategoryService) { }


protected readonly CategoryForm = new FormGroup<CategoryForm>(
    {
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
    }
    );

  onSubmit() {
    if (this.CategoryForm.invalid) {
      console.log("invalid form data");
      return;
    }
    if (this.CategoryForm.valid) {
      console.log("valid form data");
      const { name } = this.CategoryForm.value;
      if (name) {
        const category: CategoryDTO = { name };
        console.log(category);

        this.categoryService.add(category).subscribe({
          next: (data) => {
            this.CategoryForm.reset();
            console.log("category added successfully", data);
          },
          error: (error) => console.log("error while adding the category", error)
        });
      }
    }
  }

  get nameError(){
    const control = this.CategoryForm.controls.name;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Name is required';
    } else if (control?.hasError('minlength')) {
      return 'Name must be at least 3 characters long';
    } else if (control?.hasError('maxlength')) {
      return 'Name cannot be more than 10 characters long';
    }
    return '';
  }
}

