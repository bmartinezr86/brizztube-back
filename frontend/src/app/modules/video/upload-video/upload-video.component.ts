import { Component, HostListener, ViewChild, inject } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { VideoService } from '../../shared/services/video/video.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css'],
})
export class UploadVideoComponent {
  private userService = inject(UserService);
  private videoService = inject(VideoService);
  currentUser: any;
  isDragOver = false;
  selectedFile: File | null = null;
  uploading: boolean = false; // Variable para rastrear el estado de carga
  uploadProgress: number = 0; // Variable para rastrear el progreso de carga
  http: any;
  isFirstPhase: boolean = true;

  constructor(private router: Router) {}
  ngOnInit() {
    // Verifica que router esté inicializado antes de usarlo

    this.currentUser = this.userService.getCurrentUser();
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

          // Redirige internamente en la aplicación sin cerrar el diálogo
          this.router.navigateByUrl('/dashboard/upload-video-details');
        }
      },
      (error) => {
        console.error('Error al subir el video:', error);
        this.uploading = false; // Finaliza la carga en caso de error
      }
    );
  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
