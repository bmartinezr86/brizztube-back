import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from '../user/components/user/user.component';
import { SingupComponent } from '../user/components/singup/singup.component';
import { LoginComponent } from '../user/components/login/login.component';
import { MyProfileComponent } from '../user/components/my-profile/my-profile.component';
import { VideoComponent } from '../video/video/video.component';
import { ProfileComponent } from '../user/components/profile/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found/not-found.component';
import { UploadVideoDetailsComponent } from '../video/upload-video-details/upload-video-details.component';
import { PlaylistComponent } from '../playlist/playlist/playlist.component';
import { PlaylistActiveComponent } from '../playlist/playlist-active/playlist-active.component';
import { SuscriptionsUserComponent } from '../video/suscriptions-user/suscriptions-user.component';

const childRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'users/list', component: UserComponent },
  { path: 'my-profile/:id', component: ProfileComponent },
  { path: 'videos/:id', component: VideoComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'upload-video-details', component: UploadVideoDetailsComponent },
  { path: 'playlists', component: PlaylistComponent },
  { path: 'playlist/:id', component: PlaylistActiveComponent },
  { path: 'suscriptions/:id', component: SuscriptionsUserComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class RouterChildModule {}
