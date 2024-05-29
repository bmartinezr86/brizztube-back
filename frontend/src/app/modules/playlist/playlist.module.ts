import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistActiveComponent } from './playlist-active/playlist-active.component';

@NgModule({
  declarations: [PlaylistComponent, PlaylistActiveComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class PlaylistModule {}
