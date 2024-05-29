import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { VideoService } from '../../shared/services/video/video.service';
import { PlaylistService } from '../../shared/services/playlist/playlist.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { NewListComponent } from '../new-list/new-list.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent implements OnInit {
  public userService = inject(UserService);
  public videoService = inject(VideoService);
  public playlistService = inject(PlaylistService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  playlists: any[] = []; // Array para almacenar los videos
  currentUser: any;
  defaultThumbnail: string = '../../../../../assets/img/favicon.png';

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.getPlayListsByUserId(this.currentUser.id);
      console.log(this.currentUser.id);
    }
  }

  getPlayListsByUserId(userId: any): void {
    this.playlistService.listVideosByUserId(userId).subscribe(
      (response: any) => {
        if (
          response &&
          response.playListResponse &&
          response.playListResponse.playlist
        ) {
          this.playlists = response.playListResponse.playlist;
          console.log(this.playlists);
        } else {
          console.log('El usuario no ha creado ninguna lista');
        }
      },
      (error) => {
        console.error('Error fetching videos:', error);
      }
    );
  }

  getThumbnailUrl(thumbnailLocation: string | null): string {
    if (thumbnailLocation) {
      return `http://localhost:8080${thumbnailLocation}`;
    } else {
      return this.defaultThumbnail; // Ruta de la imagen predeterminada en tu proyecto Angular
    }
  }

  openUserDialogCreatePlayList() {
    const dialogRef = this.dialog.open(NewListComponent, {
      width: '20%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Lista de reproducción creada', 'Exitosa');
        this.getPlayListsByUserId(this.currentUser.id);
      } else if (result === 2) {
        this.openSnackBar(
          'Se ha producido un error al crear la lista de reproducción',
          'Error'
        );
      }
    });
  }

  onDelete(playlistId: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      data: {
        id: playlistId,
        type: 'deletePlaylist',
        message: '¿Estás seguro de eliminar el usuario?',
        confirmText: 'Sí',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Lista de reproducción eliminada', 'Exitosa');
        this.getPlayListsByUserId(this.currentUser.id);
      } else if (result === 2) {
        this.openSnackBar(
          'Se ha producido un error al eliminar la lista de reproducción',
          'Error'
        );
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
}
