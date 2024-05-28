import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VideoService } from '../../shared/services/video/video.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-video-details',
  templateUrl: './upload-video-details.component.html',
  styleUrls: ['./upload-video-details.component.css'],
})
export class UploadVideoDetailsComponent {
  private userService = inject(UserService);
  private videoService = inject(VideoService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  public uploadForm!: FormGroup;
  public categories: CategoryElement[] = [];
  public selectedFile: any;
  public nameImg: string = '';
  public data = inject(MAT_DIALOG_DATA);
  video: any;
  @Input() videoId: string | null = null;

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      titulo: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      thubmnail: [''], // Agrega el control 'thubmnail' al FormGroup
    });
    this.getCategories();

    console.log(this.data);
    console.log('id video:', this.videoId);
    if (this.videoId) {
      this.getVideo(parseInt(this.videoId));
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

    const thubmnailImageData = new FormData();

    thubmnailImageData.append('picture', data.picture, data.picture.name);
    thubmnailImageData.append('name', data.name);
    thubmnailImageData.append('description', data.description);
    thubmnailImageData.append('category', data.category);

    if (this.data != null) {
      // update user
      this.userService.updateUser(thubmnailImageData, this.data.id).subscribe(
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
      this.userService.saveUser(thubmnailImageData).subscribe(
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

  // updateForm(data: any) {
  //   this.uploadForm = this.fb.group({
  //     name: [data.name, Validators.required],
  //     description: [data.description],
  //     image: [''],
  //     category: [data.category.id, Validators.required],
  //   });
  // }

  getVideo(videoId: number) {
    this.videoService.searchVideoById(videoId).subscribe(
      (response: any) => {
        if (
          response &&
          response.videoResponse &&
          response.videoResponse.video
        ) {
          this.video = response.videoResponse.video;
          console.log(this.video);
        } else {
          console.log('No videos found');
        }
      },
      (error) => {
        // En caso de error, también redirigir a la página de "Not Found"
        this.router.navigate(['/dashboard/not-found']);
      }
    );
  }

  getVideoUrl(videoLocation: string): string {
    return `http://localhost:8080${videoLocation}`;
  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
