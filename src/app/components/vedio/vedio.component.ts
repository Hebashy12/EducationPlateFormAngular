import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms"; // Added FormsModule
import { VideoService} from "../../Services/video.service";
import { ICreateVideo } from "../../models/videoModel/icreate-video";

import { IGetSection } from "../../models/sectionModel/iget-section";
import { SectionService } from "../../Services/section.service";

@Component({
  selector: 'app-vedio',
  standalone: true,
  imports: [CommonModule, FormsModule], // Added FormsModule for ngModel
  templateUrl: './vedio.component.html',
  styleUrl: './vedio.component.css'
})
export class VedioComponent implements OnInit {
  // videoForm: ICreateVideo = {
  //   title: '',
  //   description: '',
  //   isFree: false,
  //   sectionId: 0,
  //   videoFile: null,
  //   videoImage: null
  // };
  sections:IGetSection[]=[];

  constructor(private videoService: SectionService) {

  }
  ngOnInit(): void {
    this.getSection();
  }

  getSection(){
    this.videoService.getSections(1).subscribe({
      next:(s)=>{
        this.sections=s
      }
    })
  }

  // onFileChange(event: any) {
  //   if (event.target.files.length > 0) {
  //     this.videoForm.videoFile = event.target.files[0];
  //   }
  // }

  // onImageChange(event: any) {
  //   if (event.target.files.length > 0) {
  //     this.videoForm.videoImage = event.target.files[0]; // Fixed property name
  //   }
  // }

  // submit() {
  //   const formData = new FormData();

  //   // Append all form values to FormData
  //   Object.keys(this.videoForm).forEach(key => {
  //     const value = (this.videoForm as any)[key];
  //     if (value !== null && value !== undefined) {
  //       formData.append(key, value instanceof File ? value : String(value));
  //     }
  //   });

  //   this.videoService.uploadVideo(formData).subscribe({
  //     next: (response) => {
  //       console.log('Upload successful', response);
  //       // Handle success (e.g., show message, redirect)
  //     },
  //     error: (err) => {
  //       console.error('Upload failed', err);
  //       // Handle error (e.g., show error message)
  //     }
  //   });
  // }
}
