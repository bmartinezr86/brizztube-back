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

      this.isVideoOnList(137);
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

  listPlaylistUser(userId: any) {
    this.playlistService
      .listVideosByUserId(this.currentUser.id)
      .subscribe((data: any) => {
        this.playlists = data.playListResponse.playlist; // Obtener todas las listas de reproducción
        console.log(data);
      });
  }

  isVideoOnList(videoId: any) {
    this.playlistService
      .listVideosByUserId(this.currentUser.id)
      .subscribe((data: any) => {
        this.playlists = data.playListResponse.playlist; // Obtener todas las listas de reproducción

        let videoFound = false; // Flag to indicate if video is found

        // Recorrer todas las listas de reproducción
        this.playlists.forEach((playlist: any) => {
          if (videoFound) {
            // If video already found, skip remaining playlists
            return;
          }

          playlist.videos.forEach((video: any) => {
            if (videoId === video.id) {
              console.log(
                `El video con ID ${videoId} está en la lista ${playlist.name}`
              );
              videoFound = true; // Mark video as found
            }
          });
        });

        return videoFound; // Return the result
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
