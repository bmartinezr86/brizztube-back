import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/modules/shared/services/user/user.service';
import { NewUserComponent } from '../new-user/new-user.component';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getUsers();
  }

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'email',
    'rol',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserElement>();
  @ViewChild(MatPaginator)
  public paginator!: MatPaginator;

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (data: any) => {
        console.log('respuesta users: ', data);
        this.processUsersResponse(data);
      },
      (error: any) => {
        console.log('error: ', error);
      }
    );
  }

  processUsersResponse(resp: any) {
    const dataUser: UserElement[] = [];

    if (resp.metadata[0].code == '00') {
      let listUser = resp.userResponse.user;
      console.log('User response:', listUser); // Agregar esta línea para imprimir resp.userResponse.user
      listUser.forEach((element: UserElement) => {
        element.picture = 'data:image/jpeg;base64,' + element.picture;
        dataUser.push(element);
      });

      this.dataSource = new MatTableDataSource<UserElement>(dataUser);
      console.log(this.dataSource);
      console.log('User response:', resp.userResponse.user);
      this.dataSource.paginator = this.paginator;
    }
    console.log('User response:', resp.userResponse.user);
  }

  openUserDialog() {
    const dialogRef = this.dialog.open(NewUserComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Usuario creado', 'Exitosa');
        this.getUsers();
      } else if (result == 2) {
        this.openSnackBar('Error al guardar el usuario', 'Error');
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

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Usuario eliminado', 'Exitosa');
        this.getUsers();
      } else if (result == 2) {
        this.openSnackBar(
          'Se ha producido un error al eliminar el usuario',
          'Error'
        );
      }
    });
  }

  edit(
    id: number,
    name: string,
    description: string,
    email: string,
    password: string,
    rol: any,
    status: any
    // picture: any
  ) {
    const dialogRef = this.dialog.open(NewUserComponent, {
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
        this.openSnackBar('Usuario creado', 'Exitosa');
        this.getUsers();
      } else if (result == 2) {
        this.openSnackBar('Error al guardar el usuario', 'Error');
      }
    });
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
