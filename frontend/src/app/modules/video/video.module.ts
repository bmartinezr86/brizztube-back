import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video/video.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommentsComponent } from './video/comments/comments.component';
import { AsideVideosComponent } from './video/aside-videos/aside-videos.component';

@NgModule({
  declarations: [
    VideoComponent,
    UploadVideoComponent,
    CommentsComponent,
    AsideVideosComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class VideoModule {}
