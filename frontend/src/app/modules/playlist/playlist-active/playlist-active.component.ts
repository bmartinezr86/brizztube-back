import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { VideoService } from '../../shared/services/video/video.service';
import { UserService } from '../../shared/services/user/user.service';
import { PlaylistService } from '../../shared/services/playlist/playlist.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AsideVideosComponent } from '../../video/video/aside-videos/aside-videos.component';
import { SuscriptionService } from '../../shared/services/suscription/suscription.service';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { EditDetailsVideoComponent } from '../../video/edit-details-video/edit-details-video.component';
import { AddVideosComponent } from '../add-videos/add-videos.component';

@Component({
  selector: 'app-playlist-active',
  templateUrl: './playlist-active.component.html',
  styleUrls: ['./playlist-active.component.css'],
})
export class PlaylistActiveComponent implements OnInit {
  public userService = inject(UserService);
  public videoService = inject(VideoService);
  public suscriptionService = inject(SuscriptionService);
  public playlistService = inject(PlaylistService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  playlistId!: number;
  playlist: any;
  videos: any[] = [];
  currentVideoIndex: number = 0;
  currentUser: any;
  currentVideo: any;
  currentVideoUrl: string = '';
  profileImage: string | undefined;
  isUserSubscribed: boolean = false;
  likedVideos: Set<number> = new Set(); // Set to store liked video IDs
  video: any;
  videoId: string = '';
  videoIdComments: string = '';
  isSubscribed: boolean = false;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  ngOnInit(): void {
    // Recupera el parámetro 'id' de la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      // Utiliza el ID recuperado de la URL como necesites
      if (id) {
        this.playlistId = parseInt(id);
        console.log('ID recuperado de la URL:', id);
        // Llama a la función con el ID recuperado de la URL
        this.getVideos();
      }
    });

    if (this.userService.getCurrentUser()) {
      this.currentUser = this.userService.getCurrentUser();
    }
  }

  getVideos(): void {
    this.playlistService.listVideosByPlaylistId(this.playlistId).subscribe(
      (response: any) => {
        this.playlist = response.playListResponse.playlist[0];
        this.videos = this.playlist.videos;
        if (this.videos.length > 0) {
          this.currentVideoUrl = this.getVideoLocation(
            this.videos[this.currentVideoIndex].videoLocation
          );
          this.updateCurrentVideo();
          this.videoIdComments = this.currentVideo.id;

          console.log(this.currentVideoUrl);
        }
      },
      (error: any) => {
        console.error('Error fetching videos:', error);
      }
    );
  }

  playNextVideo(): void {
    if (this.currentVideoIndex < this.videos.length - 1) {
      this.currentVideoIndex++;
    } else {
      this.currentVideoIndex = 0;
    }

    this.currentVideoUrl = this.getVideoLocation(
      this.videos[this.currentVideoIndex].videoLocation
    );

    this.updateCurrentVideo();
  }

  playPreviousVideo(): void {
    if (this.currentVideoIndex > 0) {
      this.currentVideoIndex--;
    } else {
      this.currentVideoIndex = this.videos.length - 1;
    }
    this.currentVideoUrl = this.getVideoLocation(
      this.videos[this.currentVideoIndex].videoLocation
    );
  }

  updateCurrentVideo() {
    // Verifica si hay videos disponibles en la lista
    if (this.videos.length > 0) {
      // Actualiza el video actual basado en el índice actual
      this.currentVideo = this.videos[this.currentVideoIndex];
    }
  }

  getVideoLocation(videoLocation: string): string {
    return `http://localhost:8080${videoLocation}`;
  }

  getAvatarUrl(avatarLocation: string): string {
    return `http://localhost:8080${avatarLocation}`;
  }

  getVideoThumbnailUrl(thumbnailLocation: string): string {
    return `http://localhost:8080${thumbnailLocation}`;
  }

  unmuteVideo(videoElement: HTMLVideoElement): void {
    videoElement.muted = false;
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
  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
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

  shortenTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + '...';
    }
    return title;
  }

  selectVideo(index: number): void {
    this.currentVideoIndex = index;
    this.currentVideoUrl = this.getVideoLocation(
      this.videos[this.currentVideoIndex].videoLocation
    );
    this.videoPlayer.nativeElement.load();
    this.videoPlayer.nativeElement.play();
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
      } else if (result == 2) {
        this.openSnackBar('Error al editar el vídeo', 'Error');
      }
    });
  }

  openDialogAddList(videoId: any) {
    const dialogRef = this.dialog.open(AddVideosComponent, {
      width: '20%',
      data: {
        videoId: videoId,
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

  onPlay(videoId: any): void {
    const view = new FormData();
    view.append('userId', this.currentUser.id);
    view.append('videoId', videoId);
    this.videoService.registerView(view).subscribe(
      (response: any) => {
        console.log('Visita registrada', response);
      },
      (error: any) => {
        console.log('No se ha podido registrar la visita');
      }
    );
  }
}
