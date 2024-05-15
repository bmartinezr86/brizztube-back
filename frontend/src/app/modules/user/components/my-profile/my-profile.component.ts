import { Component, OnInit, inject } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
  public userService = inject(UserService);
  currentUser: any;
  profileImage: string | undefined;

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.getUserProfile();
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
