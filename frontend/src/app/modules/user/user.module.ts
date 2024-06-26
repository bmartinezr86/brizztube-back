import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './components/user/user.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewUserComponent } from './components/new-user/new-user.component';
import { SingupComponent } from './components/singup/singup.component';
import { LoginComponent } from './components/login/login.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile/profile.component';

@NgModule({
  declarations: [
    UserComponent,
    NewUserComponent,
    SingupComponent,
    LoginComponent,
    MyProfileComponent,
    EditProfileComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class UserModule {}
