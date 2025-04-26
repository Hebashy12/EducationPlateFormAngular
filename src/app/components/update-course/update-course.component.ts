import { Component, inject, OnInit } from '@angular/core';
import { Course, CourseService } from '../../Services/course.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-course',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.css'
})
export class UpdateCourseComponent implements OnInit {
  protected  course:Course|null =null;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courses = inject(CourseService);
  protected  courseStatuses = Object.values(CourseStatus);
  imagePreview: string | ArrayBuffer | null = null;
courseStatusFocused: any;
discountFocused: any;
priceFocused: any;
descriptionFocused: any;
titleFocused: any;
categoriesIdFocused: any;




onSubmit() {
  if(this.updateCourseForm.invalid)
  {
    console.log("invalid form data");
    return
  }
  if(this.updateCourseForm.valid){
console.log("valid form data");
const {CategoriesId,CourseStatus,CourseImage,Description,IsSequentialWatch,Title, DiscountPercentage, Price}  = this.updateCourseForm.value;
if(CategoriesId&&CourseStatus&&Description&&DiscountPercentage&&Price&&IsSequentialWatch!==null&&IsSequentialWatch!==undefined&&Title&&CourseImage!==undefined)
{

   const course:CourseDTO2 = {CategoriesId,CourseStatus,CourseImage,Description,IsSequentialWatch,Title, DiscountPercentage, Price}

   console.log(course)
  this.courses.update(this.route.snapshot.params['id'],course).subscribe({
    next: (data) => {
      this.updateCourseForm.reset();
        console.log("course added succesfully", data)
    }
    ,
    error:(error)=>console.log("error while adding the course",error)
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

    this.updateCourseForm.patchValue({ CourseImage: file });
    this.updateCourseForm.controls.CourseImage.updateValueAndValidity();
  }
}

courseStatus:CourseStatus[] = Object.values(CourseStatus);

categories: Category[]|null = null;


patchForm(course: Course) {
  this.updateCourseForm.patchValue({
    Title: course!.title,
    Description: course!.description,
    Price: course!.price,
    DiscountPercentage: course!.discountPercentage,
    CourseStatus: course!.courseStatus,
    CategoriesId: course!.categoriesId,
    IsSequentialWatch: course!.isSequentialWatch,
    // Skip courseImage for now – file inputs can't be patched
  });
}
ngOnInit(): void {

  this.courses.getCourseById(this.route.snapshot.params['id']).subscribe({
    next: ({data}) => {
      console.log(data)
    this.course = data;
    this.imagePreview = data!.courseImage

    this.patchForm(this.course!)
    },
    error: (err) => {
      this.router.navigate(['/notFound']);
      console.log("error fetching course",err);
    }

  });

  this.courses.getAllCategories().subscribe({
    next: (categories) => {
      this.categories = categories;
    },
    error: (err) => {
      console.error('Failed to load categories', err);
    }
  });
}



  protected readonly updateCourseForm = new FormGroup<CourseForm>(
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
        Validators.nullValidator,
      ]),


    }
  );

  protected get titleError(): string {
    const control = this.updateCourseForm.controls.Title;
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
    const control = this.updateCourseForm.controls.Description;
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
    const control = this.updateCourseForm.controls.Price;

    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Price is required.';
    }
    if (control?.hasError('min')) {
      return 'Price cannot be negative.';
    }
    return '';
  }

  protected get discountError(): string {
    const control = this.updateCourseForm.controls.DiscountPercentage;

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
    const control = this.updateCourseForm.controls.CourseStatus;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Course status is required.';
    }
    return '';
  }

  protected get categoriesIdError(): string {
    const control = this.updateCourseForm.controls.CategoriesId;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Category Id is required.';
    }
    return '';
  }

  protected get courseImageError(): string {
    const control = this.updateCourseForm.controls.CourseImage;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Course image is required.';
    }
    return '';
  }




}

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
export function getCourseFormData2(course: CourseDTO2): FormData {

  const formData = new FormData();

formData.append('Title', course.Title);
formData.append('Description', course.Description);
formData.append('Price', course.Price.toString());
formData.append('DiscountPercentage', course.DiscountPercentage.toString());
formData.append('CourseStatus', course.CourseStatus);
formData.append('CategoriesId', course.CategoriesId.toString());
formData.append('IsSequentialWatch', course.IsSequentialWatch.toString());
if(course.CourseImage){
  formData.append('CourseImage',course.CourseImage as Blob,course.CourseImage.name);
}

return formData;

  }
export type Category = {
  categorieId: number;
  name: string;
  courses?: Course[] | null;
  isDeleted: boolean;
  createOn: string;
  lastUpdateOn: string | null;
}
export type CourseDTO2 =  {
  Title: string;
  Description: string;
  Price: number;
  DiscountPercentage: number;
  CourseStatus: string;
  CategoriesId: number;
  IsSequentialWatch: boolean;
  CourseImage: File|null; // For file uploads, we use `File` type instead of `string`
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

