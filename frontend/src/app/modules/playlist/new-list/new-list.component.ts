import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlaylistService } from '../../shared/services/playlist/playlist.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.css'],
})
export class NewListComponent implements OnInit {
  estadoFormulario: string = '';
  playlist!: FormGroup;
  private userService = inject(UserService);
  private playlistService = inject(PlaylistService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  public playlistForm!: FormGroup;
  public data = inject(MAT_DIALOG_DATA);
  currentUser: any;

  ngOnInit(): void {
    this.estadoFormulario = 'Crear';
    this.playlistForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      console.log(this.currentUser.id);
    }

    if (this.data != null) {
      this.updateForm(this.data);
      this.estadoFormulario = 'Modificar';
    }
  }

  onSave() {
    let data = {
      name: this.playlistForm.get('name')?.value,
    };

    const playlistCreated = new FormData();

    playlistCreated.append('name', data.name);
    playlistCreated.append('userId', this.currentUser.id);

    if (this.data != null) {
      // update user
      this.playlistService
        .modifyPlaylist(playlistCreated, this.data.id)
        .subscribe(
          (data: any) => {
            console.log(data);
            this.dialogRef.close(1);
          },
          (error: any) => {
            this.dialogRef.close(2);
          }
        );
    } else {
      // create playlis
      this.playlistService.createPlaylist(playlistCreated).subscribe(
        (data: any) => {
          console.log(data);
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  updateForm(data: any) {
    this.playlistForm = this.fb.group({
      name: [data.name, Validators.required],
    });
  }
}
