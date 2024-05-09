import { Component, OnInit, inject } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  public currentUser: any;

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();

    if (this.currentUser) {
      console.log('Current User:', this.currentUser);
    }
  }
}
