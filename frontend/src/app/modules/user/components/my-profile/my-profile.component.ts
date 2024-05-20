import { Component, OnInit, inject } from '@angular/core';
import { SuscriptionService } from 'src/app/modules/shared/services/suscription/suscription.service';
import { UserService } from 'src/app/modules/shared/services/user/user.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { VideoService } from 'src/app/modules/shared/services/video/video.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
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
    this.getMyVideos(this.currentUser.id);
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

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Perfil editado correctamente', 'Exitosa');
        window.location.reload();
      } else if (result == 2) {
        this.openSnackBar('Error al guardar los cambios', 'Error');
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

  getMyVideos(userId: number) {
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
