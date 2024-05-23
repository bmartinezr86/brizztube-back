import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { SuscriptionService } from '../../shared/services/suscription/suscription.service';
import { VideoService } from '../../shared/services/video/video.service';
import { MatDialog } from '@angular/material/dialog';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
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

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.getUserProfile();
    this.getSuscriberCount();
    this.getMyVideo(this.currentUser.id);
    console.log(this.currentUser.id);
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

  getSuscriberCount() {
    this.suscriptionService
      .countSuscribers(this.currentUser.id)
      .subscribe((resp: any) => {
        if (resp.metadata[0].code == '00') {
          this.suscriberCount = resp.suscriptionResponse.subscriberCount;
        }
      });
  }

  subscribe() {
    const subscriberId = this.currentUser.id; // Assumes current user is subscribing
    const subscribedTo = this.currentUser.id; // Change this to the correct user ID being subscribed to
    this.suscriptionService
      .suscribe(subscriberId, subscribedTo)
      .subscribe((resp: any) => {
        if (resp.metadata[0].code == '00') {
          this.getSuscriberCount();
        }
      });
  }

  unsubscribe() {
    const subscriberId = this.currentUser.id; // Assumes current user is unsubscribing
    const subscribedTo = this.currentUser.id; // Change this to the correct user ID being unsubscribed from
    this.suscriptionService
      .unsuscribe(subscriberId, subscribedTo)
      .subscribe((resp: any) => {
        if (resp.metadata[0].code == '00') {
          this.getSuscriberCount();
        }
      });
  }

  isSubscribed(): boolean {
    return this.isUserSubscribed;
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getMyVideo(userId: number) {
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

  editVideo() {}

  belongsToCurrentUser(video: any): boolean {
    if (video.user.id !== this.currentUser.id) {
      return false;
    }

    return true;
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
