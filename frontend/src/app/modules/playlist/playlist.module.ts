import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistActiveComponent } from './playlist-active/playlist-active.component';
import { NewListComponent } from './new-list/new-list.component';
import { VideoModule } from '../video/video.module';
import { AddVideosComponent } from './add-videos/add-videos.component';

@NgModule({
  declarations: [PlaylistComponent, PlaylistActiveComponent, NewListComponent, AddVideosComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    VideoModule,
  ],
})
export class PlaylistModule {}
