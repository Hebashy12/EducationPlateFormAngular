import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../Services/video.service';
export type Section = {
  sectionId: number;
  sectionName: string;
  isPassSection: boolean;
  videosNum: number;
  quizId? : number|null;
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

export type VideoDTO2 = {
  Title: string;
  Description: string;
 IsFree: boolean;

  ThumbnailImage: File|null;
  VideoFile: File|null;
};

export function getVideoFormData2(video : VideoDTO2): FormData {

  const formData = new FormData();

formData.append('Title', video.Title);
formData.append('Description', video.Description);

formData.append('IsFree', video.IsFree.toString());

if(video.ThumbnailImage)
formData.append('ThumbnailImage',video.ThumbnailImage as Blob,video.ThumbnailImage.name);
if( video.VideoFile)
formData.append('VideoFile',video.VideoFile as Blob,video.VideoFile.name);

return formData;

  }

  export type VideoForm2 ={
    Title: FormControl<string|null>;
    Description: FormControl<string|null>;
    IsFree: FormControl<boolean|null>;
    ThumbnailImage: FormControl<File | null>;
    VideoFile: FormControl<File | null>;
  }
@Component({
  selector: 'app-update-video',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-video.component.html',
  styleUrl: './update-video.component.css'
})
export class UpdateVideoComponent implements OnInit {

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    loading:boolean = false;

    protected video: Video | null = null;
    @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;
    @ViewChild('videoInput') videoInputRef!: ElementRef<HTMLInputElement>;

      ngOnInit(): void {
        this.videoService._getVideoById(this.route.snapshot.params['videoId']).subscribe({
          next: (data) => {

            this.video = data;
            if (!this.video) {
              this.router.navigate(['/notFound']);
              return;
            }
            if (this.video) {
              this.patchForm(this.video);
              this.imagePreview = this.video.videoImageUrl;
              this.videoPreview = this.video.videoFileUrl;
            }
          },
          error: (error) => {console.log('error while getting the video', error)
          this.router.navigate(['/notFound']);
          this.loading = false;
          this.resetForm();

          },
        });

      }

      private readonly videoService = inject(VideoService);

      patchForm(video: Video) {
        this.updateVideoForm.patchValue({
          Title: video!.title,
          Description: video!.description,
          IsFree: video!.isFree,


        });
      }

      resetForm(): void {
        this.updateVideoForm.reset();

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
        if(this.updateVideoForm.invalid)
        {
          console.log("invalid form data");
          return
        }
        if(this.updateVideoForm.valid){

      const {Description,IsFree, ThumbnailImage, Title, VideoFile}  = this.updateVideoForm.value;
      if(VideoFile!==undefined&&ThumbnailImage!==undefined&&Description&&IsFree!==null&&IsFree!==undefined&&Title)
      {
         const video:VideoDTO2 = {Description,IsFree, ThumbnailImage, Title, VideoFile}


         console.log(video);
         this.loading = true;
        this.videoService.update(this.route.snapshot.params['videoId'],video).subscribe({
          next: (data) => {
          this.resetForm();
            this.loading = false;
              console.log("video updated succesfully", data)
          }
          ,
          error:(error)=>{console.log("error while updating the video",error)
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
          this.updateVideoForm.patchValue({ ThumbnailImage: file });
          this.updateVideoForm.controls.ThumbnailImage.updateValueAndValidity();
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

          this.updateVideoForm.patchValue({ VideoFile: file });
          this.updateVideoForm.controls.VideoFile.updateValueAndValidity();
        }
      }



      protected readonly updateVideoForm = new FormGroup<VideoForm2>(
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
            Validators.nullValidator,
          ]),


          IsFree: new FormControl<boolean|null>(false),

          ThumbnailImage: new FormControl<File | null>(null, [
            Validators.nullValidator,
          ]),
        }
      );

      protected get titleError(): string {
        const control = this.updateVideoForm.controls.Title;
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
        const control = this.updateVideoForm.controls.Description;
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
        const control = this.updateVideoForm.controls.VideoFile;
        if (control?.hasError('required') && (control.dirty || control.touched)) {
          return 'Video file is required.';
        }
        return '';
      }

      protected get thumbnailImageError(): string {
        const control = this.updateVideoForm.controls.ThumbnailImage;
        if (control?.hasError('required') && (control.dirty || control.touched)) {
          return 'Thumbnail image is required.';
        }
        return '';
      }

    }



