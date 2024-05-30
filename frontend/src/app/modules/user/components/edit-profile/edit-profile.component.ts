import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/modules/shared/services/user/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  public userForm!: FormGroup;
  public roles: RolElement[] = [];
  public hidePassword: boolean = true;
  public selectedFile: any;
  public nameImg: string = '';
  public data = inject(MAT_DIALOG_DATA);
  private originalPassword = '';

  ngOnInit(): void {
    this.userForm = this.fb.group({
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
      image: [''],
      rol: [3, Validators.required],
      status: [4, Validators.required],
    });
    this.getRoles();
    this.getStatus();
    console.log(this.data);
    if (this.data != null) {
      console.log(this.data.picture);
      this.updateForm(this.data);
    }
  }

  getRoles(): void {
    this.userService.getRoles().subscribe(
      (data: any) => {
        console.log('respuesta roles: ', data);
        this.processRolesResponse(data);
      },
      (error: any) => {
        console.log('error: ', error);
      }
    );
  }

  processRolesResponse(resp: any) {
    const dataRol: RolElement[] = [];

    if (
      resp.metadata[0].code == '00' &&
      resp.rolResponse &&
      resp.rolResponse.rol
    ) {
      let listRoles = resp.rolResponse.rol;
      console.log('Roles response:', listRoles); // Agregar esta línea para imprimir resp.rolResponse.rol
      listRoles.forEach((element: RolElement) => {
        dataRol.push(element);
      });
      this.roles = dataRol;
      // Aquí puedes hacer lo que necesites con los roles obtenidos
      console.log('Roles procesados:', dataRol);
    } else {
      console.error(
        'La respuesta no contiene la estructura esperada para los roles.'
      );
    }
  }
  getStatus(): void {
    this.userService.getStatus().subscribe(
      (data: any) => {
        console.log('respuesta estados: ', data);
        this.processStatusResponse(data);
      },
      (error: any) => {
        console.log('error: ', error);
      }
    );
  }

  processStatusResponse(resp: any) {
    const dataStatus: StatusElement[] = [];

    if (
      resp.metadata[0].code == '00' &&
      resp.userStatusResponse &&
      resp.userStatusResponse.userStatus
    ) {
      let listStatus = resp.userStatusResponse.userStatus;
      console.log('Status response:', listStatus); // Agregar esta línea para imprimir resp.userStatusResponse.userStatus
      listStatus.forEach((element: StatusElement) => {
        dataStatus.push(element);
      });

      // Aquí puedes hacer lo que necesites con los estados obtenidos
      console.log('Estados procesados:', dataStatus);
    } else {
      console.error(
        'La respuesta no contiene la estructura esperada para los estados.'
      );
    }
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
      name: this.userForm.get('name')?.value,
      description: this.userForm.get('description')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value || this.originalPassword,
      rol: this.userForm.get('rol')?.value,
      status: this.userForm.get('status')?.value,
      picture: this.selectedFile,
    };

    const uploadImageData = new FormData();
    if (data.picture) {
      uploadImageData.append('picture', data.picture, data.picture.name);
    }

    uploadImageData.append('name', data.name);
    uploadImageData.append('description', data.description);
    uploadImageData.append('email', data.email);
    uploadImageData.append('password', data.password);
    uploadImageData.append('rol', data.rol);
    uploadImageData.append('status', data.status);

    // update user
    this.userService.updateUser(uploadImageData, this.data.id).subscribe(
      (updateUser: any) => {
        console.log(updateUser);
        this.userService.setCurrentUser(updateUser.userResponse.user[0]);
        this.dialogRef.close(updateUser);
        window.location.reload();
      },
      (error: any) => {
        this.dialogRef.close(2);
      }
    );
  }

  onCancel() {
    this.dialogRef.close(3);
  }

  updateForm(data: any) {
    this.userForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description],
      email: [data.email, [Validators.required, Validators.email]],
      password: [''],
      image: [''],
      rol: [data.rol.id, Validators.required],
      status: [data.status.id, Validators.required],
    });

    this.originalPassword = data.password;
  }
}
export interface RolElement {
  id: number;
  name: string;
  description: string;
}

export interface StatusElement {
  id: number;
  name: string;
  description: string;
}
