import { Component, OnInit, inject } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user/user.service';
import { VideoService } from 'src/app/modules/shared/services/video/video.service';
import { VideoComponent } from 'src/app/modules/video/video/video.component';
import { formatDistanceToNow as distanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  public currentUser: any;
  profileImage: string | undefined;
  videoService = inject(VideoService);

  videos: any;
  showSearchResults: boolean = false;
  noResultsFound: boolean = false;

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.getUserProfile();
    }

    this.videoService.getVideosHome().subscribe((videos: any[]) => {
      this.videos = videos;
    });

    this.videoService
      .getSearchState()
      .subscribe(
        (state: { showSearchResults: boolean; noResultsFound: boolean }) => {
          this.showSearchResults = state.showSearchResults;
          this.noResultsFound = state.noResultsFound;
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

  shortenDescription(description: string, maxLength: number): string {
    if (!description || description.length === 0) {
      return '';
    }
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  }

  getDescription(video: any, maxLength: number): string {
    return video.showFullDescription
      ? video.description
      : this.shortenDescription(video.description, maxLength);
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
