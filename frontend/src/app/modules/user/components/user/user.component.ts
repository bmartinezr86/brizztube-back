import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/modules/shared/services/user/user.service';
import { NewUserComponent } from '../new-user/new-user.component';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private router = inject(Router);
  currentUser: any;

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.isLoggedIn();
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

  isLoggedIn(): boolean {
    if (this.userService.isLoggedIn()) {
      this.isAdmin();
    }
    return this.userService.isLoggedIn();
  }

  isAdmin(): void {
    if (this.currentUser.rol.name !== 'Administrator') {
      this.router.navigate(['/dashboard']);
    }
  }

  processUsersResponse(resp: any) {
    const dataUser: UserElement[] = [];

    if (resp.metadata[0].code == '00') {
      let listUser = resp.userResponse.user;
      console.log('User response:', listUser); // Agregar esta línea para imprimir resp.userResponse.user
      listUser.forEach((element: UserElement) => {
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
      data: {
        id: id,
        type: 'deleteUser',
        message: '¿Estás seguro de eliminar el usuario?',
        confirmText: 'Sí',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar('Usuario eliminado', 'Exitosa');
        this.getUsers();
      } else if (result === 2) {
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
        this.openSnackBar('Usuario editado', 'Exitosa');
        this.getUsers();
      } else if (result == 2) {
        this.openSnackBar('Error al editar el usuario', 'Error');
      }
    });
  }

  search(name: any) {
    if (name.length === 0) {
      return this.getUsers();
    } else {
      this.userService.getUserByName(name).subscribe((resp: any) => {
        this.processUsersResponse(resp);
      });
    }
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
