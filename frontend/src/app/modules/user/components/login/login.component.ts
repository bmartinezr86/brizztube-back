import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { UserService } from 'src/app/modules/shared/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  public loginForm!: FormGroup;
  public hidePassword: boolean = true;
  public urlFrontBase = 'http://localhost:4200/dashboard';
  private snackBar = inject(MatSnackBar);
  public errorMessage: string = '';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login() {
    let data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    const credentials = new FormData();
    credentials.append('email', data.email);
    credentials.append('password', data.password);

    // login user
    this.userService.loginUser(credentials).subscribe(
      (data: any) => {
        console.log(data);
        this.userService.setCurrentUser(data.userResponse.user[0]);
        window.location.href = this.urlFrontBase;
        console.log(data.userResponse.user[0]);
      },
      (error: any) => {
        if (error.metadata && error.metadata[0].code === '-1') {
          this.errorMessage = error.metadata[0].date; // Mensaje de error
          console.error('Error al iniciar sesión:', error);
        } else {
          this.errorMessage = error.metadata[0].date;
          console.error('Error al iniciar sesión:', error);
        }
      }
    );
  }
}
