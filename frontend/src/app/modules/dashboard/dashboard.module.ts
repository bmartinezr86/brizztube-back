import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { VideoModule } from '../video/video.module';

@NgModule({
  declarations: [DashboardComponent, HomeComponent],
  imports: [CommonModule, RouterModule, SharedModule, UserModule, VideoModule],
})
export class DashboardModule {}
