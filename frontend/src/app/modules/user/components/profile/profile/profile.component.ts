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
