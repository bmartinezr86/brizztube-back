import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video/video.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';



@NgModule({
  declarations: [
    VideoComponent,
    UploadVideoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class VideoModule { }
