import { Component, HostListener, ViewChild, inject } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { VideoService } from '../../shared/services/video/video.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css'],
})
export class UploadVideoComponent {
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
  public uploadForm!: FormGroup;
  public categories: CategoryElement[] = [];
  public nameImg: string = '';

  constructor() {}
  ngOnInit() {
    // Verifica que router esté inicializado antes de usarlo

    this.currentUser = this.userService.getCurrentUser();

    this.uploadForm = this.fb.group({
      title: ['', Validators.required], // Ejemplo de declaración de un control con validación requerida
      description: [''], // Ejemplo de declaración de un control sin validación
      categoryId: ['', Validators.required],
      thubmnailFile: [''],
    });
    this.getCategories();
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    this.preventDefault(event);
    this.isDragOver = true;
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    this.preventDefault(event);
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.preventDefault(event);
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    this.preventDefault(event);
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.validateFile(this.selectedFile);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.validateFile(this.selectedFile)) {
      this.uploadVideo();
    }
  }

  openFileInput() {
    const inputElement: HTMLInputElement | null = document.getElementById(
      'fileInput'
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  }

  validateFile(file: File | null): boolean {
    if (!file) {
      console.error('No file selected');
      return false;
    }

    const allowedExtensions = ['mp4', 'avi', 'mov'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(extension)) {
      console.error('Invalid file format. Only MP4, AVI, or MOV allowed.');
      this.selectedFile = null;
      return false;
    }

    const maxSize = 200 * 1024 * 1024; // 200MB in bytes
    if (file.size > maxSize) {
      console.error('File size exceeds the maximum limit of 200MB.');
      this.selectedFile = null;
      return false;
    }

    return true;
  }

  preventDefault(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDropped(event: DragEvent) {
    this.preventDefault(event);
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.validateFile(this.selectedFile);
    }
  }

  nextPhase() {
    // Cambia a la siguiente fase del formulario
    this.isFirstPhase = false;
  }

  previousPhase() {
    // Cambia a la fase anterior del formulario
    this.isFirstPhase = true;
  }

  uploadVideo() {
    if (!this.selectedFile) {
      console.error('No se ha seleccionado ningún archivo.');
      return;
    }

    if (!this.currentUser) {
      console.error('No hay un usuario actualmente autenticado.');
      return;
    }

    const formData = new FormData();
    formData.append('videoFile', this.selectedFile);
    formData.append('userId', this.currentUser.id);

    this.uploading = true; // Comienza la carga
    this.videoService.uploadVideo(formData).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Calcula el progreso de carga en porcentaje
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          console.log('Video subido exitosamente:', event.body);
          this.uploading = false; // Finaliza la carga
          const videoArray = event.body.videoResponse.video; // Accede al array de videos
          if (videoArray.length > 0) {
            this.uploadedVideoId = videoArray[0].id; // Asigna el ID del primer video subido
            console.log(this.uploadedVideoId);
            this.nextPhase(); // Cambia a la siguiente fase
            this.getVideo(this.uploadedVideoId);
          } else {
            console.error('No se encontraron videos en la respuesta.');
          }
        }
      },
      (error) => {
        console.error('Error al subir el video:', error);
        this.uploading = false; // Finaliza la carga en caso de error
      }
    );
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
    this.nameImg = event.target.files[0].name;
    console.log(this.selectedFile);
    console.log(this.nameImg);
  }

  onSave() {
    let data = {
      title: this.uploadForm.get('title')?.value,
      description: this.uploadForm.get('description')?.value,
      categoryId: this.uploadForm.get('categoryId')?.value,
      thubmnailFile: this.selectedFile,
    };

    const thumbnailImageData = new FormData();

    if (data.thubmnailFile) {
      thumbnailImageData.append(
        'thumbnailFile',
        data.thubmnailFile,
        data.thubmnailFile.name
      );
    }
    thumbnailImageData.append('title', data.title);
    thumbnailImageData.append('description', data.description);
    thumbnailImageData.append('categoryId', data.categoryId);

    if (this.data != null) {
      // update user
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
      // create user
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
