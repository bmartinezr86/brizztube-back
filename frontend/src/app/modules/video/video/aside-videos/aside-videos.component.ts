import { Component, OnInit, inject } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user/user.service';
import { VideoService } from 'src/app/modules/shared/services/video/video.service';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-aside-videos',
  templateUrl: './aside-videos.component.html',
  styleUrls: ['./aside-videos.component.css'],
})
export class AsideVideosComponent implements OnInit {
  ngOnInit(): void {
    this.loadVideos();
  }
  public userService = inject(UserService);
  public videoService = inject(VideoService);
  videos: any[] = []; // Array para almacenar los videos

  loadVideos() {
    this.videoService.search().subscribe(
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

  shortenTitle(title: string, maxLength: number): string {
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + '...';
    }
    return title;
  }
}
