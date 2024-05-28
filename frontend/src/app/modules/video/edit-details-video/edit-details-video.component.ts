import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { VideoService } from '../../shared/services/video/video.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';

@Component({
  selector: 'app-edit-details-video',
  templateUrl: './edit-details-video.component.html',
  styleUrls: ['./edit-details-video.component.css'],
})
export class EditDetailsVideoComponent implements OnInit {
  private userService = inject(UserService);
  private videoService = inject(VideoService);
  private dialogRef = inject(MatDialogRef);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  public data = inject(MAT_DIALOG_DATA);
  currentUser: any;
  isDragOver = false;
  selectedFile: File | null = null;
  uploading: boolean = false; // Variable para rastrear el estado de carga
  uploadProgress: number = 0; // Variable para rastrear el progreso de carga
  http: any;
  isFirstPhase: boolean = true;
  uploadedVideoId!: any;
  video: any;
  public updateForm!: FormGroup;
  public categories: CategoryElement[] = [];
  public nameImg: string = '';
  public thumbnailUrl: string = '';
  currentThumbnailUrl: string = '';

  ngOnInit(): void {
    this.getCategories();
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      thubmnailFile: [''],
    });

    console.log(this.data);

    if (this.data != null) {
      if (this.data && this.data.thubmnail) {
        this.currentThumbnailUrl = this.data.thubmnail;
      }
      this.uploadedVideoId = this.data.id;
      console.log(this.data.category.id);
      this.updateFieldForm(this.data);
    }
  }
  onCancel() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      data: {
        id: this.selectedFile ? this.selectedFile.name : null, // Pasar el ID o nombre del archivo si es relevante
        title: 'Cancelar subida de video',
        message: '¿Estás seguro de cancelar la subida del video?',
        confirmText: 'Sí',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        // Si el usuario confirma, cierra el diálogo actual
        this.dialogRef.close();
      }
    });
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
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

    // Si se selecciona un archivo nuevo, mostrar su vista previa
    if (this.selectedFile) {
      this.nameImg = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.thumbnailUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      // Si no se selecciona ningún archivo nuevo, mantener la miniatura actual
      this.thumbnailUrl = this.currentThumbnailUrl;
    }
  }

  onSave() {
    let data = {
      title: this.updateForm.get('title')?.value,
      description: this.updateForm.get('description')?.value,
      categoryId: this.updateForm.get('categoryId')?.value,
      thubmnailFile: this.selectedFile,
    };

    const thumbnailImageData = new FormData();

    // Agregar miniatura al FormData solo si se seleccionó un archivo
    if (data.thubmnailFile) {
      thumbnailImageData.append(
        'thumbnailFile',
        data.thubmnailFile,
        data.thubmnailFile.name
      );
    }

    // Agregar otros campos al FormData
    thumbnailImageData.append('title', data.title);
    thumbnailImageData.append('description', data.description);
    thumbnailImageData.append('categoryId', data.categoryId);

    // Si hay datos existentes (es decir, se está actualizando), usar el servicio para actualizar
    if (this.data != null) {
      this.videoService
        .saveDetailsVideo(thumbnailImageData, this.uploadedVideoId)
        .subscribe(
          (data: any) => {
            console.log(data);
            this.dialogRef.close(1);
          },
          (error: any) => {
            this.dialogRef.close(2);
          }
        );
    } else {
      // Si no hay datos existentes (es decir, se está creando), usar el servicio para crear
      this.videoService
        .saveDetailsVideo(thumbnailImageData, this.uploadedVideoId)
        .subscribe(
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

  // updateForm(data: any) {
  //   this.updateForm = this.fb.group({
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

  updateFieldForm(data: any) {
    console.log('Datos recibidos para actualizar el formulario: ', data);
    console.log('Categorías disponibles: ', this.categories);

    this.updateForm.patchValue({
      title: data.title,
      description: data.description,
      categoryId: data.category.id,
    });
    this.nameImg = data.thumbnailFileName;
    this.thumbnailUrl = this.getVideoUrl(data.thubmnail);
    console.log(data.thubmnail);
  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
