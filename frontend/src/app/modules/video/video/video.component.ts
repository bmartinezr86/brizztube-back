import { Component, Input, OnInit, inject } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { SuscriptionService } from '../../shared/services/suscription/suscription.service';
import { VideoService } from '../../shared/services/video/video.service';
import { MatDialog } from '@angular/material/dialog';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Observable, Subscription } from 'rxjs';

import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EditDetailsVideoComponent } from '../edit-details-video/edit-details-video.component';
import { NewListComponent } from '../../playlist/new-list/new-list.component';
import { AddVideosComponent } from '../../playlist/add-videos/add-videos.component';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
  public userService = inject(UserService);
  public videoService = inject(VideoService);
  public suscriptionService = inject(SuscriptionService);
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  currentUser: any;
  profileImage: string | undefined;
  isUserSubscribed: boolean = false;
  videos: any[] = []; // Array para almacenar los videos
  likedVideos: Set<number> = new Set(); // Set to store liked video IDs
  routeSubscription: Subscription | undefined;
  video: any;
  videoId: string = '';

  isSubscribed: boolean = false;

  ngOnInit(): void {
    // Recupera el parámetro 'id' de la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      // Utiliza el ID recuperado de la URL como necesites
      if (id) {
        console.log('ID recuperado de la URL:', id);
        // Llama a la función con el ID recuperado de la URL
        this.getVideo(parseInt(id));
      }
    });
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadVideo(videoId: number) {
    this.videoService.searchVideoById(videoId).subscribe(
      (video) => {
        this.video = video;
        this.checkSubscription(this.currentUser.id, video.user.id);
      },
      (error) => {
        console.error('Error loading video:', error);
      }
    );
  }

  navigateToVideo(videoId: number) {
    this.router.navigate(['/videos', videoId]);
  }
  getUserProfile() {
    this.userService.getUserById(this.currentUser.id).subscribe((resp: any) => {
      this.processUserResponse(resp);
    });
  }

  processUserResponse(resp: any) {
    const dataCategory: UserElement[] = [];

    if (resp.metadata[0].code == '00') {
      const userData = resp.userResponse.user[0]; // Assuming single user

      // Extract profile image URL from userData
      const profileImageUrl = userData.picture;
      console.log(profileImageUrl);

      // Pass profile image URL to handleProfileImage
      this.handleProfileImage(profileImageUrl);
    }
  }

  handleProfileImage(pictureUser: any) {
    if (pictureUser) {
      this.profileImage = 'data:image/jpeg;base64,' + pictureUser; // Establecer datos Base64 si están disponibles
    } else {
      this.profileImage = '../../../../../assets/img/default-profile.png';
    }
  }

  subscribe(video: any) {
    const suscribed = new FormData();
    suscribed.append('subscriberId', this.currentUser.id);
    suscribed.append('subscribedTo', video.user.id);

    if (!this.checkSubscription(this.currentUser.id, video.user.id)) {
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

  unsubscribe(video: any) {
    const suscribed = new FormData();
    suscribed.append('subscriberId', this.currentUser.id);
    suscribed.append('subscribedTo', video.user.id);

    if (this.checkSubscription(this.currentUser.id, video.user.id)) {
      this.suscriptionService
        .unsuscribe(this.currentUser.id, video.user.id)
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

  // Por ejemplo, en algún método de tu componente

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getVideo(videoId: number) {
    this.videoService.searchVideoById(videoId).subscribe(
      (response: any) => {
        if (
          response &&
          response.videoResponse &&
          response.videoResponse.video
        ) {
          this.video = response.videoResponse.video;
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

  openEditVideosForm(video: any) {
    const dialogRef = this.dialog.open(EditDetailsVideoComponent, {
      width: '45%',
      data: {
        id: video.id,
        title: video.title,
        description: video.description,
        category: video.category,
        thubmnail: video.thumbnailLocation,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Vídeo editado', 'Exitosa');
        // Recargar la página después de 1 segundo
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (result == 2) {
        this.openSnackBar('Error al editar el vídeo', 'Error');
      }
    });
  }

  belongsToCurrentUser(video: any): boolean {
    if (
      video.user &&
      this.currentUser &&
      video.user.id === this.currentUser.id
    ) {
      return true;
    } else {
      return false;
    }
  }

  toggleLike(video: any) {
    if (this.likedVideos.has(video.id)) {
      this.unlikeVideo(video);
    } else {
      this.likeVideo(video);
    }
  }

  likeVideo(video: any) {
    const like = new FormData();
    like.append('videoId', video.id);
    like.append('userId', this.currentUser.id);
    this.videoService.like(like).subscribe((resp: any) => {
      if (resp.metadata[0].code === '00') {
        video.totalLikes++;
        this.likedVideos.add(video.id); // Add to liked videos
        this.openSnackBar('Liked the video', 'OK');
      } else {
        this.openSnackBar('Error liking the video', 'OK');
      }
    });
  }

  unlikeVideo(video: any) {
    this.videoService
      .unlike(video.id, this.currentUser.id)
      .subscribe((resp: any) => {
        if (resp.metadata[0].code === '00') {
          video.totalLikes--;
          this.likedVideos.delete(video.id); // Remove from liked videos
          this.openSnackBar('Unliked the video', 'OK');
        } else {
          this.openSnackBar('Error unliking the video', 'OK');
        }
      });
  }

  shortenDescription(description: string, maxLength: number): string {
    if (!description || description.length === 0) {
      return '';
    }
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  }
  toggleDescription(video: any): void {
    video.showFullDescription = !video.showFullDescription;
  }

  getDescription(video: any, maxLength: number): string {
    return video.showFullDescription
      ? video.description
      : this.shortenDescription(video.description, maxLength);
  }

  getAvatarUrl(avatarLocation: string): string {
    return `http://localhost:8080${avatarLocation}`;
  }

  openDialogAddList(videoId: any) {
    const dialogRef = this.dialog.open(AddVideosComponent, {
      width: '20%',
      data: {
        id: videoId,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('El video ha sido añadido con exito', 'Exitosa');
      } else if (result === 2) {
        this.openSnackBar(
          'Se ha producido un error al añadir el video a la lista de reproducción',
          'Error'
        );
      }
    });
  }
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
