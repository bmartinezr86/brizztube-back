import { MediaMatcher } from '@angular/cdk/layout';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { VideoService } from '../../services/video/video.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewUserComponent } from 'src/app/modules/user/components/new-user/new-user.component';
import { UploadVideoComponent } from 'src/app/modules/video/upload-video/upload-video.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  public userService = inject(UserService);
  public videoSrv = inject(VideoService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private router = inject(Router);
  currentUser: any;
  userId: any;
  profileImage: string | undefined;
  mobileQuery: MediaQueryList;
  mostrarEnMovil = false;
  mostrarFormularioBusqueda = false;
  mostrarEnDesktop = false;
  urlFrontBaseDashboard = 'http://localhost:4200/dashboard';
  urlLogin = 'http://localhost:4200/login';
  menuNav: any[] = [];
  menuUser: any[] = [];

  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mostrarEnMovil = window.innerWidth <= 870;
    this.mostrarEnDesktop = !this.mostrarEnMovil;
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.getUserProfile();
      this.userId = this.currentUser.id;
    }

    this.menuNav = [
      {
        type: 'option', // Indica que este elemento es una opción del menú
        name: 'Inicio',
        route: 'home',
        icon: 'home',
      },
      {
        type: 'option',
        name: 'Suscripciones',
        route: 'subscriptions',
        icon: 'subscriptions',
      },
      {
        type: 'separator',
      },
      {
        type: 'option',
        name: 'Mi perfil',
        route: this.generateRouteWithId('my-profile/:id', this.userId),
        icon: 'account_circle',
      },
      {
        type: 'option',
        name: 'Historial',
        route: 'history',
        icon: 'history',
      },
      {
        type: 'option',
        name: 'Listas de repro...',
        route: 'playlist',
        icon: 'playlist_play',
      },
      {
        type: 'separator',
      },
      // {
      //   type: 'option',
      //   name: 'Configuración',
      //   route: 'settings',
      //   icon: 'settings',
      // },
      {
        type: 'option',
        name: 'Ayuda',
        route: 'help',
        icon: 'help',
      },
      {
        type: 'separator',
      },
      {
        type: 'option',
        name: 'Usuarios',
        route: 'users/list',
        icon: 'people',
      },
    ];

    this.menuUser = [
      {
        name: 'Mi perfil',
        route: this.generateRouteWithId('my-profile/:id', this.userId),
        icon: 'person',
      },
      // {
      //   name: 'Preferencias',
      //   route: 'settings',
      //   icon: 'settings',
      // },
      {
        name: 'Cerrar sesión',
        click: this.logout.bind(this),
        icon: 'exit_to_app',
      },
    ];
  }

  generateRouteWithId(route: string, id: string): string {
    return route.replace(':id', id);
  }
  toggleFormularioBusqueda() {
    this.mostrarFormularioBusqueda = !this.mostrarFormularioBusqueda;
  }

  redirectToLogin() {
    let url = this.urlLogin;
    window.location.href = url;
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

  logout() {
    this.userService.logoutUser();
    window.location.href = this.urlFrontBaseDashboard;
  }

  filterVideos(filter: any) {
    this.videoSrv.getVideosByFilter(filter.value).subscribe(
      (response: any) => {
        if (
          response &&
          response.videoResponse &&
          response.videoResponse.video.length > 0
        ) {
          this.videoSrv.setVideosHome(response.videoResponse.video);
          this.videoSrv.setSearchState({
            showSearchResults: true,
            noResultsFound: false,
          });
        } else {
          this.videoSrv.setVideosHome([]);
          this.videoSrv.setSearchState({
            showSearchResults: true,
            noResultsFound: true,
          });
        }
      },
      (error) => {
        this.videoSrv.setVideosHome([]);
        this.videoSrv.setSearchState({
          showSearchResults: true,
          noResultsFound: true,
        });
      }
    );
  }

  onSubmit(filtro: any): void {
    // Evitar el comportamiento por defecto de recargar la página
    this.filterVideos(filtro);
    this.router.navigateByUrl('/dashboard');
  }

  openUploadVideosForm() {
    const dialogRef = this.dialog.open(UploadVideoComponent, {
      width: '45%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Vídeo subido', 'Exitosa');
      } else if (result == 2) {
        this.openSnackBar('Error al subir el vídeo', 'Error');
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
