import { Component, OnInit, inject } from '@angular/core';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { SuscriptionService } from 'src/app/modules/shared/services/suscription/suscription.service';
import { UserService } from 'src/app/modules/shared/services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { VideoService } from 'src/app/modules/shared/services/video/video.service';
import { Subscription } from 'rxjs';
import { EditProfileComponent } from '../../edit-profile/edit-profile.component';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { EditDetailsVideoComponent } from 'src/app/modules/video/edit-details-video/edit-details-video.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public userService = inject(UserService);
  public suscriptionService = inject(SuscriptionService);
  public videoService = inject(VideoService);
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  currentUser: any;
  profileImage: string | undefined;
  suscriberCount: number = 0;
  isUserSubscribed: boolean = false;
  videos: any[] = []; // Array para almacenar los videos
  user: any;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  routeSubscription: Subscription | undefined;
  video: any;
  videoId: string = '';
  isSubscribed: boolean = false;

  ngOnInit(): void {
    // Recupera el parámetro 'id' de la URL
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');
      // Utiliza el ID recuperado de la URL como necesites
      if (id) {
        console.log('ID recuperado de la URL:', id);
        // Llama a la función con el ID recuperado de la URL
        this.getUserProfile(parseInt(id));
        this.getVideosUser(parseInt(id));
      }
    });
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  subscribe(user: any) {
    const suscribed = new FormData();
    suscribed.append('subscriberId', this.currentUser.id);
    suscribed.append('subscribedTo', user.id);

    if (!this.checkSubscription(this.currentUser.id, user.id)) {
      this.suscriptionService.suscribe(suscribed).subscribe(
        (response) => {
          console.log('Subscription successful:', response);
          this.isSubscribed = true; // Update subscription status
        },
        (error) => {
          console.error('Subscription error:', error);
          // Handle error message display
        }
      );
    }
  }

  unsubscribe(user: any) {
    const suscribed = new FormData();
    suscribed.append('subscriberId', this.currentUser.id);
    suscribed.append('subscribedTo', user.id);

    if (this.checkSubscription(this.currentUser.id, user.id)) {
      this.suscriptionService
        .unsuscribe(this.currentUser.id, user.id)
        .subscribe(
          (response: any) => {
            console.log('Unsubscription successful:', response);
            this.isSubscribed = false; // Update subscription status
          },
          (error: any) => {
            console.error('Unsubscription error:', error);
            // Handle error message display
          }
        );
    }
  }

  checkSubscription(subscriberId: any, subscribedToId: any) {
    this.suscriptionService
      .checkSubscription(subscriberId, subscribedToId)
      .subscribe(
        (isSubscribed) => {
          this.isSubscribed = isSubscribed;
        },
        (error) => {
          console.error('CheckSubscription error:', error);
          // Handle error message display
        }
      );

    return this.isSubscribed;
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getUserProfile(userId: any) {
    console.log('Llamando a getUserProfile con ID:', userId); // Log para depuración
    this.userService.getUserById(userId).subscribe(
      (response: any) => {
        if (response && response.userResponse && response.userResponse.user) {
          this.user = response.userResponse.user;
          console.log(this.user);
        } else {
          console.log('User not found');
        }
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }
  getVideosUser(userId: number) {
    this.videoService.searchVideoByUserId(userId).subscribe(
      (response: any) => {
        if (
          response &&
          response.videoResponse &&
          response.videoResponse.video
        ) {
          this.videos = response.videoResponse.video;
          console.log(this.videos);
        } else {
          console.log('No videos found');
        }
      },
      (error) => {
        console.error('Error fetching videos:', error);
      }
    );
  }

  getVideoThumbnailUrl(thumbnailLocation: string): string {
    return `http://localhost:8080${thumbnailLocation}`;
  }
  formatDistanceToNow(date: any): string {
    const distance = distanceToNow(date, {
      locale: es,
      includeSeconds: true,
    });
    if (distance) {
      // Eliminar "alrededor de" de la cadena y devolver solo "hace X tiempo"
      return distance.replace('alrededor de', '');
    } else {
      return '';
    }
  }

  getUserRole(): string {
    return this.user.role;
  }

  getAvatarUrl(avatarLocation: string): string {
    return `http://localhost:8080${avatarLocation}`;
  }

  openEditVideosForm(videoId: any) {
    const dialogRef = this.dialog.open(EditDetailsVideoComponent, {
      width: '45%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Vídeo subido', 'Exitosa');
      } else if (result == 2) {
        this.openSnackBar('Error al subir el vídeo', 'Error');
      }
    });
  }

  deleteVideo(id: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '350px',
      data: {
        message: '¿Estás seguro de que deseas eliminar este video?',
        confirmText: 'Sí',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.videoService.deleteVideo(id).subscribe(
          (response: any) => {
            console.log('Video eliminado:', response);
            // Actualiza la lista de videos después de la eliminación
            this.videos = this.videos.filter((video) => video.id !== id);
          },
          (error) => {
            console.error('Error eliminando el video:', error);
          }
        );
      }
    });
  }

  editProfile(
    id: number,
    name: string,
    description: string,
    email: string,
    password: string,
    rol: any,
    status: any
    // picture: picture,
  ) {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '600px',
      data: {
        id: id,
        name: name,
        description: description,
        email: email,
        password: password,
        rol: rol,
        status: status,
        // picture: picture,
      },
    });
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

export interface UserElement {
  id: number;
  name: string;
  description: string;
  email: string;
  picture: any;
  rol: {
    id: number;
    name: string;
    description: string;
  };
  status: {
    id: number;
    name: string;
    description: string;
  };
}
