import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { VideoService } from '../../shared/services/video/video.service';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
@Component({
  selector: 'app-suscriptions-user',
  templateUrl: './suscriptions-user.component.html',
  styleUrls: ['./suscriptions-user.component.css'],
})
export class SuscriptionsUserComponent implements OnInit {
  public userService = inject(UserService);
  public videoService = inject(VideoService);
  currentUser: any;
  videos: any[] = []; // Array para almacenar los videos
  videosCount: number = 0;

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.getVideosToSubs(this.currentUser.id);
    }
  }

  getVideosToSubs(userId: any) {
    this.videoService.getSubsVideosUser(userId).subscribe(
      (response: any) => {
        if (
          response &&
          response.videoResponse &&
          response.videoResponse.video
        ) {
          this.videos = response.videoResponse.video;
          this.videosCount = this.videos.length;
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

  getAvatarUrl(avatarLocation: string): string {
    return `http://localhost:8080${avatarLocation}`;
  }

  getVideoUrl(videoLocation: string): string {
    return `http://localhost:8080${videoLocation}`;
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
}
