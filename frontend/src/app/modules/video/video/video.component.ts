import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { SuscriptionService } from '../../shared/services/suscription/suscription.service';
import { VideoService } from '../../shared/services/video/video.service';
import { MatDialog } from '@angular/material/dialog';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Subscription } from 'rxjs';

import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

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
  suscriberCount: number = 0;
  isUserSubscribed: boolean = false;
  videos: any[] = []; // Array para almacenar los videos
  likedVideos: Set<number> = new Set(); // Set to store liked video IDs
  routeSubscription: Subscription | undefined;
  video: any;
  videoId: string = '';

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const videoId = +params['id']; // assuming your route is something like /videos/:id
      this.loadVideo(videoId);
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.videoId = id;
      }
    });
    this.currentUser = this.userService.getCurrentUser();
    this.getUserProfile();
    this.getSuscriberCount();
    this.getMyVideo(this.currentUser.id);
    console.log(this.currentUser.id);
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

  getSuscriberCount() {
    this.suscriptionService
      .countSuscribers(this.currentUser.id)
      .subscribe((resp: any) => {
        if (resp.metadata[0].code == '00') {
          this.suscriberCount = resp.suscriptionResponse.subscriberCount;
        }
      });
  }

  subscribe(video: any) {
    const suscribed = new FormData();
    suscribed.append('subscriberId', this.currentUser.id);
    suscribed.append('subscribedTo', video.user.id);
    this.suscriptionService.suscribe(suscribed).subscribe((resp: any) => {
      if (resp.metadata[0].code == '00') {
        this.getSuscriberCount();
      }
    });
  }

  unsubscribe(video: any) {
    const subscriberId = this.currentUser.id; // Assumes current user is unsubscribing
    const subscribedTo = video.user.id; // Change this to the correct user ID being unsubscribed from
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

  getMyVideo(videoId: number) {
    this.videoService.searchVideoById(videoId).subscribe(
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
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...';
    }
    return description;
  }

  toggleDescription(video: any): void {
    video.showFullDescription = !video.showFullDescription;
  }

  getDescription(video: any, maxLength: number): string {
    return video.showFullDescription
      ? video.description
      : this.shortenDescription(video.description, maxLength);
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
