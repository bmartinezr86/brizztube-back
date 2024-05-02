import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * get all users
   * @returns
   */
  getUsers() {
    const endpoint = `${base_url}/users`;
    return this.http.get(endpoint);
  }
}
