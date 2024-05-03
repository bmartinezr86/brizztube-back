import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close(3);
  }

  delete() {
    if (this.data != null) {
      this.userService.deleteUser(this.data.id).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    } else {
      this.dialogRef.close(2);
    }
  }
}
