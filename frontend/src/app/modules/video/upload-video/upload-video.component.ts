import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VideoService } from '../../shared/services/video/video.service';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css'],
})
export class UploadVideoComponent {
  private userService = inject(UserService);
  private videoService = inject(VideoService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  public uploadForm!: FormGroup;
  public categories: CategoryElement[] = [];
  public hidePassword: boolean = true;
  public estadoFormulario: string = '';
  public selectedFile: any;
  public nameImg: string = '';
  public data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.estadoFormulario = 'Subir';
    this.uploadForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
    });
    this.getCategories();

    console.log(this.data);

    if (this.data != null) {
      console.log(this.data.picture);
      this.updateForm(this.data);
      this.estadoFormulario = 'Editar';
    }
  }

  getCategories(): void {
    this.videoService.getCategories().subscribe(
      (data: any) => {
        console.log('respuesta estados: ', data);
        this.processCategoriesResponse(data);
      },
      (error: any) => {
        console.log('error: ', error);
      }
    );
  }

  processCategoriesResponse(resp: any) {
    const dataCategories: CategoryElement[] = [];

    if (
      resp.metadata[0].code == '00' &&
      resp.categoryResponse &&
      resp.categoryResponse.category
    ) {
      let listCategories = resp.categoryResponse.category;
      console.log('Categories response:', listCategories); // Agregar esta línea para imprimir resp.userStatusResponse.userStatus
      listCategories.forEach((element: CategoryElement) => {
        dataCategories.push(element);
      });

      this.categories = dataCategories;
      // Aquí puedes hacer lo que necesites con los estados obtenidos
      console.log('Estados procesados:', dataCategories);
    } else {
      console.error(
        'La respuesta no contiene la estructura esperada para las categorias.'
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
      name: this.uploadForm.get('name')?.value,
      description: this.uploadForm.get('description')?.value,
      category: this.uploadForm.get('category')?.value,
      picture: this.selectedFile,
    };

    const uploadImageData = new FormData();

    uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('description', data.description);
    uploadImageData.append('category', data.category);

    if (this.data != null) {
      // update user
      this.userService.updateUser(uploadImageData, this.data.id).subscribe(
        (data: any) => {
          console.log(data);
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    } else {
      // create user
      this.userService.saveUser(uploadImageData).subscribe(
        (data: any) => {
          console.log(data);
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close(3);
  }

  updateForm(data: any) {
    this.uploadForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description],
      image: [''],
      category: [data.category.id, Validators.required],
    });
  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
