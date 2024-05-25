import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent {
  urlFrontBaseDashboard = 'http://localhost:4200/dashboard';

  backToHome() {
    let url = this.urlFrontBaseDashboard;
    window.location.href = url;
  }
}
