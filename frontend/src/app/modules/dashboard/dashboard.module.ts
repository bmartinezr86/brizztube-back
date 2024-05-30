import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { VideoModule } from '../video/video.module';
import { PlaylistModule } from '../playlist/playlist.module';

import { NotFoundComponent } from './pages/not-found/not-found/not-found.component';
import { MaterialModule } from '../shared/material.module';
import { FeedComponent } from './components/feed/feed/feed.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    NotFoundComponent,
    FeedComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserModule,
    VideoModule,
    MaterialModule,
    RouterModule,
    PlaylistModule,
  ],
})
export class DashboardModule {}
