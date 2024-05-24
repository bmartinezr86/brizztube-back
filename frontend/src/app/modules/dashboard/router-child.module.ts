import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from '../user/components/user/user.component';
import { SingupComponent } from '../user/components/singup/singup.component';
import { LoginComponent } from '../user/components/login/login.component';
import { MyProfileComponent } from '../user/components/my-profile/my-profile.component';
import { VideoComponent } from '../video/video/video.component';
import { ProfileComponent } from '../user/components/profile/profile/profile.component';

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
  { path: 'singup', component: SingupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'videos/:id', component: VideoComponent },
  { path: 'profile/:id', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class RouterChildModule {}
