import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/modules/shared/services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);

  ngOnInit(): void {
    this.getUsers();
  }

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'email',
    // 'rol',
    // 'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserElement>();

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
        dataUser.push(element);
      });

      this.dataSource = new MatTableDataSource<UserElement>(dataUser);
      console.log(this.dataSource);
      console.log('User response:', resp.userResponse.user);
      // this.dataSource.paginator = this.paginator;
    }
    console.log('User response:', resp.userResponse.user);
  }

  delete(id: any) {}

  edit(id: number, name: string, description: string) {}
}

export interface UserElement {
  id: number;
  name: string;
  description: string;
  email: string;
}
