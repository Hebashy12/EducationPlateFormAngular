import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course, CourseService } from '../../Services/course.service';

import {  ToastrService } from 'ngx-toastr';

export type PaginatedResponse<T> = {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  firstPage: string;
  lastPage: string;
  nextPage: string | null;
  previousPage: string | null;
  data: T[];
  statusCode: number;
  errors: any;
  isSuccess: boolean;
  message: string | null;
}
export function getCourseFormData(course: CourseDTO): FormData {

  const formData = new FormData();

formData.append('Title', course.Title);
formData.append('Description', course.Description);
formData.append('Price', course.Price.toString());
formData.append('DiscountPercentage', course.DiscountPercentage.toString());
formData.append('CourseStatus', course.CourseStatus);
formData.append('CategoriesId', course.CategoriesId.toString());
formData.append('IsSequentialWatch', course.IsSequentialWatch.toString());
formData.append('CourseImage',course.CourseImage as Blob,course.CourseImage.name);
return formData;

  }
export type Category = {
  categorieId: number;
  name: string;
  // courses?: Course[] | null;
  isDeleted: boolean;
  createOn: string;
  lastUpdateOn: string | null;
}
export type CourseDTO =  {
  Title: string;
  Description: string;
  Price: number;
  DiscountPercentage: number;
  CourseStatus: string;
  CategoriesId: number;
  IsSequentialWatch: boolean;
  CourseImage: File; // For file uploads, we use `File` type instead of `string`
};

 export const CourseStatus =
  {	NotComplete:"NotComplete",
	Completed:"Completed",
	WillComingSoon:"WillComingSoon"} as const

  export  type CourseStatus = typeof CourseStatus[keyof typeof CourseStatus];

export type CourseForm ={
  Title: FormControl<string|null>;
  Description: FormControl<string|null>;
  Price: FormControl<number|null>;
  DiscountPercentage: FormControl<number|null>;
  CourseStatus: FormControl<CourseStatus|null>;
  CategoriesId: FormControl<number|null>;
  IsSequentialWatch: FormControl<boolean|null>;
  CourseImage: FormControl<File | null>;
}

@Component({
  selector: 'app-add-course',
  imports: [ReactiveFormsModule,CommonModule ],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css'
})
export class AddCourseComponent implements OnInit{
  toastr: ToastrService = inject(ToastrService);


// Add these properties to your component class
titleFocused = false;
descriptionFocused = false;
priceFocused = false;
discountFocused = false;
statusFocused = false;
categoryFocused = false;
isSubmitting = false;

// Add this to your onSubmit method


  private readonly courses = inject(CourseService);
  protected  courseStatuses = Object.values(CourseStatus);
  imagePreview: string | ArrayBuffer | null=null;
onSubmit() {
  if(this.addCourseForm.invalid)
  {
    console.log("invalid form data");
    return
  }
  if(this.addCourseForm.valid){

const {CategoriesId,CourseStatus,CourseImage,Description,IsSequentialWatch,Title, DiscountPercentage, Price}  = this.addCourseForm.value;
if(CategoriesId&&CourseStatus&&CourseImage&&Description&&DiscountPercentage&&Price&&IsSequentialWatch!==null&&IsSequentialWatch!==undefined&&Title)
{
  this.isSubmitting = true;
   const course:CourseDTO = {CategoriesId,CourseStatus,CourseImage,Description,IsSequentialWatch,Title, DiscountPercentage, Price}
if(CourseImage.size>0)

   console.log(course)
  this.courses.add(course).subscribe({
    next: (data) => {
      this.isSubmitting = false;
      this.addCourseForm.reset();
      this.toastr.success("Course added successfully", "Success");
        console.log("course added succesfully", data)
    }
    ,
    error:(error)=>{
      this.isSubmitting = false;
      console.log("error while adding the course",error)}
  })

  }
}

}
onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    const reader = new FileReader();

    // Once the image is loaded, set the preview
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    // Read the file as a data URL to generate the preview
    reader.readAsDataURL(file);
    this.addCourseForm.patchValue({ CourseImage: file });
    this.addCourseForm.controls.CourseImage.updateValueAndValidity();
  }
}

courseStatus:CourseStatus[] = Object.values(CourseStatus);

categories: Category[]|null = null;

ngOnInit(): void {
  this.courses.getAllCategories().subscribe({
    next: (categories) => {
      this.categories = categories;
    },
    error: (err) => {
      console.error('Failed to load categories', err);
    }
  });
}



  protected readonly addCourseForm = new FormGroup<CourseForm>(
    {
      Title: new FormControl<string|null>('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
      Description: new FormControl<string|null>('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(200),
      ]),
      CourseStatus: new FormControl<CourseStatus | null>(null, [
        Validators.required,

      ]),
      Price: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),

      DiscountPercentage: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      CategoriesId: new FormControl<number | null>(null, [
        Validators.required,
      ]),

      IsSequentialWatch: new FormControl<boolean|null>(false),

      CourseImage: new FormControl<File | null>(null, [
        Validators.required,
      ]),


    }
  );

  protected get titleError(): string {
    const control = this.addCourseForm.controls.Title;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Title is required.';
    }
    if (control?.hasError('minlength')) {
      return 'Title must be at least 10 characters.';
    }
    if (control?.hasError('maxlength')) {
      return 'Title cannot exceed 100 characters.';
    }
    return '';
  }
  protected get descriptionError(): string {
    const control = this.addCourseForm.controls.Description;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Description is required.';
    }
    if (control?.hasError('minlength')) {
      return 'Description must be at least 20 characters.';
    }
    if (control?.hasError('maxlength')) {
      return 'Description cannot exceed 200 characters.';
    }
    return '';
  }

  protected get priceError(): string {
    const control = this.addCourseForm.controls.Price;

    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Price is required.';
    }
    if (control?.hasError('min')) {
      return 'Price cannot be negative.';
    }
    return '';
  }

  protected get discountError(): string {
    const control = this.addCourseForm.controls.DiscountPercentage;

    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Discount is required.';
    }

    if (control?.hasError('min')) {
      return 'Discount must be 0 or more.';
    }
    if (control?.hasError('max')) {
      return 'Discount cannot exceed 100%.';
    }
    return '';
  }

  protected get courseStatusError(): string {
    const control = this.addCourseForm.controls.CourseStatus;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Course status is required.';
    }
    return '';
  }

  protected get categoriesIdError(): string {
    const control = this.addCourseForm.controls.CategoriesId;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Category Id is required.';
    }
    return '';
  }

  protected get courseImageError(): string {
    const control = this.addCourseForm.controls.CourseImage;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Course image is required.';
    }
    return '';
  }




}
