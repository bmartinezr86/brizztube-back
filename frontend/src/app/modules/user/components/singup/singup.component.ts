import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/modules/shared/services/user/user.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css'],
})
export class SingupComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  public registroForm!: FormGroup;
  public hidePassword: boolean = true;
  public estadoFormulario: string = '';
  public selectedFile: any;
  public nameImg: string = '';
  public acceptTerms: boolean = false;
  public urlFrontBase = 'http://localhost:4200/dashboard';

  ngOnInit(): void {
    this.registroForm = this.fb.group(
      {
        name: ['', Validators.required],
        description: [''],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/),
          ],
        ],
        passwordConfirm: ['', [Validators.required]],
        image: [''],
        rol: [3],
        status: [2],
        acceptTerms: [false, Validators.required],
      },
      { validator: this.confirmPasswordValidator }
    );
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.nameImg = event.target.files[0].name;
    console.log(this.selectedFile);
    console.log(this.nameImg);
  }
  onSave() {
    let data = {
      name: this.registroForm.get('name')?.value,
      description: this.registroForm.get('description')?.value,
      email: this.registroForm.get('email')?.value,
      password: this.registroForm.get('password')?.value,
      rol: 3,
      status: 2,
      picture: this.selectedFile,
    };

    const uploadImageData = new FormData();

    uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('description', data.description);
    uploadImageData.append('email', data.email);
    uploadImageData.append('password', data.password);
    uploadImageData.append('rol', data.rol.toString());
    uploadImageData.append('status', data.status.toString());

    // create user
    this.userService.saveUser(uploadImageData).subscribe(
      (data: any) => {
        console.log(data);
        let url = this.urlFrontBase;
        window.location.href = url;
      },
      (error: any) => {}
    );
  }

  confirmPasswordValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!confirmPasswordControl) {
      return; // Si no se encuentra el control, sal de la función
    }

    if (
      !confirmPasswordControl.errors ||
      !confirmPasswordControl.errors['confirmPassword']
    ) {
      return;
    }

    if (
      !passwordControl ||
      passwordControl.value !== confirmPasswordControl.value
    ) {
      confirmPasswordControl.setErrors({ confirmPassword: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  }
}
