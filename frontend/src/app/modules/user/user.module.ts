import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './components/user/user.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewUserComponent } from './components/new-user/new-user.component';

@NgModule({
  declarations: [UserComponent, NewUserComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
})
export class UserModule {}
