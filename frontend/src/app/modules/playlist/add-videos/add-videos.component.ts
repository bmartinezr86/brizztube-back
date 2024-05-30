import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { VideoService } from '../../shared/services/video/video.service';
import { PlaylistService } from '../../shared/services/playlist/playlist.service';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewListComponent } from '../new-list/new-list.component';

@Component({
  selector: 'app-add-videos',
  templateUrl: './add-videos.component.html',
  styleUrls: ['./add-videos.component.css'],
})
export class AddVideosComponent implements OnInit {
  public userService = inject(UserService);
  public videoService = inject(VideoService);
  public playlistService = inject(PlaylistService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  public dialog = inject(MatDialog);
  public AddVideoToPlaylistForm!: FormGroup;
  selectedPlaylists: { [key: number]: boolean } = {};

  currentUser: any;
  playlists: any[] = [];

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.listPlaylistUser(this.currentUser.id);

      this.AddVideoToPlaylistForm = this.fb.group({
        selectedPlaylists: this.fb.array([], Validators.required),
      });

      // this.isVideoOnList(137);
    }
  }

  onSave() {
    const selectedPlaylists =
      this.AddVideoToPlaylistForm.get('selectedPlaylists')?.value;
    selectedPlaylists.forEach((playlistId: number) => {
      this.playlistService
        .addVideoToPlaylist(playlistId, this.data.id)
        .subscribe(
          (data: any) => {
            console.log(data);
            this.dialogRef.close(1);
          },
          (error: any) => {
            this.dialogRef.close(2);
          }
        );
    });
  }

  onCheckboxChange(e: any) {
    const selectedPlaylists: FormArray = this.AddVideoToPlaylistForm.get(
      'selectedPlaylists'
    ) as FormArray;

    if (e.target.checked) {
      selectedPlaylists.push(this.fb.control(e.target.value));
    } else {
      const index = selectedPlaylists.controls.findIndex(
        (x) => x.value === e.target.value
      );
      selectedPlaylists.removeAt(index);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  openUserDialogCreatePlayList() {
    const dialogRef = this.dialog.open(NewListComponent, {
      width: '20%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Lista de reproducción creada', 'Exitosa');
        this.listPlaylistUser(this.currentUser.id);
      } else if (result === 2) {
        this.openSnackBar(
          'Se ha producido un error al crear la lista de reproducción',
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

  // Lógica para añadir o eliminar video de la lista
  toggleVideoInPlaylist(playlistId: number, videoId: number): void {
    if (this.isVideoOnList(playlistId, videoId)) {
      this.removeVideoFromList(playlistId, videoId);
    } else {
      this.addVideoToList(playlistId, videoId);
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  // Método para añadir un video a la lista
  addVideoToList(playlistId: number, videoId: number): void {
    this.playlistService.addVideoToPlaylist(playlistId, videoId).subscribe({
      next: () => {
        console.log(
          `Añadido video con ID ${videoId} a la lista con ID ${playlistId}`
        );
        const playlist = this.playlists.find((pl) => pl.id === playlistId);
        if (playlist) {
          playlist.videos.push({ id: videoId });
        }
      },
      error: (err) => console.error('Error añadiendo video a la lista', err),
    });
  }

  // Método para eliminar un video de la lista
  removeVideoFromList(playlistId: number, videoId: number): void {
    this.playlistService.removeVideoToPlaylist(playlistId, videoId).subscribe({
      next: () => {
        console.log(
          `Eliminado video con ID ${videoId} de la lista con ID ${playlistId}`
        );
        const playlist = this.playlists.find((pl) => pl.id === playlistId);
        if (playlist) {
          playlist.videos = playlist.videos.filter(
            (video: any) => video.id !== videoId
          );
        }
      },
      error: (err) => console.error('Error eliminando video de la lista', err),
    });
  }

  // Método para verificar si el video está en la lista
  isVideoOnList(playlistId: number, videoId: number): boolean {
    const playlist = this.playlists.find((pl) => pl.id === playlistId);
    return playlist
      ? playlist.videos.some((video: any) => video.id === videoId)
      : false;
  }

  // Llama a un servicio para obtener las listas de reproducción del usuario
  listPlaylistUser(userId: any): void {
    this.playlistService.listVideosByUserId(userId).subscribe((data: any) => {
      this.playlists = data.playListResponse.playlist; // Obtener todas las listas de reproducción
      console.log(this.playlists);
    });
  }
}
