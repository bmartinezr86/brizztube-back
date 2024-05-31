import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VideoService } from '../../services/video/video.service';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { CommentService } from '../../services/comment/comment.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  private userService = inject(UserService);
  private videoService = inject(VideoService);
  private playlistService = inject(PlaylistService);
  private commentService = inject(CommentService);
  private dialogRef = inject(MatDialogRef);

  public data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close(3);
  }

  onConfirm() {
    if (this.data && this.data.type) {
      switch (this.data.type) {
        case 'deleteUser':
          this.deleteUser(this.data.id);
          break;
        case 'deleteVideo':
          this.deleteVideo(this.data.id);
          break;
        case 'deletePlaylist':
          this.deletePlaylist(this.data.id);
          break;

        case 'deleteComment':
          this.deleteComment(this.data.id);
          break;
        default:
          this.dialogRef.close(2); // Tipo no soportado
          break;
      }
    } else {
      this.dialogRef.close(2); // Datos no válidos
    }
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(
      (data: any) => {
        this.dialogRef.close(1); // Éxito
      },
      (error: any) => {
        this.dialogRef.close(2); // Error
      }
    );
  }

  deleteVideo(id: string) {
    this.videoService.deleteVideo(id).subscribe(
      (data: any) => {
        this.dialogRef.close(1); // Éxito
      },
      (error: any) => {
        this.dialogRef.close(2); // Error
      }
    );
  }

  deletePlaylist(id: any) {
    this.playlistService.deletePlaylist(id).subscribe(
      (data: any) => {
        this.dialogRef.close(1); // Éxito
      },
      (error) => {
        this.dialogRef.close(2); // Error
      }
    );
  }

  deleteComment(id: any) {
    this.commentService.delete(id).subscribe(
      (data: any) => {
        this.dialogRef.close(1); // Éxito
      },
      (error) => {
        this.dialogRef.close(2); // Error
      }
    );
  }
}
