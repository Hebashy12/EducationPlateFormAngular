import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideoService } from '../../Services/video.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
export type Section = {
  sectionId: number;
  sectionName: string;
  isPassSection: boolean;
  videosNum: number;
};
export type Video = {
  videoId: number;
  title: string;
  description: string;
  videoDuration: string;
  isFree: boolean;
  videoImageUrl: string;
  videoFileUrl: string;
  sectionId: number;
  section: Section|null;
  feedBacks: any[]|null;
};

export type VideoDTO = {
  Title: string;
  Description: string;
 IsFree: boolean;
  SectionId: number;
  ThumbnailImage: File;
  VideoFile: File;
};

export function getVideoFormData(video : VideoDTO): FormData {

  const formData = new FormData();

formData.append('Title', video.Title);
formData.append('Description', video.Description);
formData.append('SectionId', video.SectionId.toString());
formData.append('IsFree', video.IsFree.toString());
formData.append('ThumbnailImage',video.ThumbnailImage as Blob,video.ThumbnailImage.name);
formData.append('VideoFile',video.VideoFile as Blob,video.VideoFile.name);
return formData;

  }

  export type VideoForm ={
    Title: FormControl<string|null>;
    Description: FormControl<string|null>;
    IsFree: FormControl<boolean|null>;
    SectionId: FormControl<number|null>;
    ThumbnailImage: FormControl<File | null>;
    VideoFile: FormControl<File | null>;
  }
@Component({
  selector: 'app-add-video',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-video.component.html',
  styleUrl: './add-video.component.css'
})
export class AddVideoComponent implements OnInit {

  titleFocused = false;
  descriptionFocused = false;
  videoFileFocused = false;
  thumbnailImageFocused = false;
  sectionFocused = false;

  constructor() {}

  private readonly router = inject(Router);
 
private readonly route = inject(ActivatedRoute);
loading:boolean = false;

@ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;
@ViewChild('videoInput') videoInputRef!: ElementRef<HTMLInputElement>;
  ngOnInit(): void {
      this.videoService.getSectionsByCourseId(this.route.snapshot.params['courseId']).subscribe({
        next:(data)=>{this.sections=data;console.log(data)},

        error:(error)=>console.log("error while getting sections",error)});
  }

  private readonly videoService = inject(VideoService);

  resetForm(): void {
    this.addVideoForm.reset();

    this.imagePreview = null;
    this.videoPreview = null;

    if (this.imageInputRef) {
      this.imageInputRef.nativeElement.value = '';
    }

    if (this.videoInputRef) {
      this.videoInputRef.nativeElement.value = '';
    }
  }
  onSubmit() {
    if(this.addVideoForm.invalid)
    {
      console.log("invalid form data");
      return
    }
    if(this.addVideoForm.valid){

  const {Description,IsFree,SectionId, ThumbnailImage, Title, VideoFile}  = this.addVideoForm.value;
  if(SectionId&&VideoFile&&ThumbnailImage&&Description&&IsFree!==null&&IsFree!==undefined&&Title)
  {
     const video:VideoDTO = {Description,IsFree,SectionId, ThumbnailImage, Title, VideoFile}


     console.log(video);
     this.loading = true;
    this.videoService.add(video).subscribe({
      next: (data) => {
      this.resetForm();
        this.loading = false;
          console.log("video added succesfully", data)
      }
      ,
      error:(error)=>{console.log("error while adding the video",error)
      this.loading = false;
     this.resetForm();

      }
    })


    }
  }

  }

  imagePreview: string | ArrayBuffer | null=null;
  videoPreview: string | ArrayBuffer | null=null;

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
      this.addVideoForm.patchValue({ ThumbnailImage: file });
      this.addVideoForm.controls.ThumbnailImage.updateValueAndValidity();
    }
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.videoPreview = reader.result; // This can be bound to a <video> element's [src]
      };

      reader.readAsDataURL(file); // Creates a base64 preview URL

      this.addVideoForm.patchValue({ VideoFile: file });
      this.addVideoForm.controls.VideoFile.updateValueAndValidity();
    }
  }

  protected sections :Section[]|null = null;

  protected readonly addVideoForm = new FormGroup<VideoForm>(
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
      VideoFile: new FormControl<File | null>(null, [
        Validators.required,
      ]),
      SectionId: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1),
      ]),

      IsFree: new FormControl<boolean|null>(false),

      ThumbnailImage: new FormControl<File | null>(null, [
        Validators.required,
      ]),
    }
  );

  protected get titleError(): string {
    const control = this.addVideoForm.controls.Title;
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
    const control = this.addVideoForm.controls.Description;
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

  protected get videoFileError(): string {
    const control = this.addVideoForm.controls.VideoFile;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Video file is required.';
    }
    return '';
  }

  protected get thumbnailImageError(): string {
    const control = this.addVideoForm.controls.ThumbnailImage;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Thumbnail image is required.';
    }
    return '';
  }

  protected get sectionIdError(): string {
    const control = this.addVideoForm.controls.SectionId;
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return 'Section ID is required.';
    }
    if (control?.hasError('min')) {
      return 'Section ID must be greater than 0.';
    }
    return '';
  }

}
