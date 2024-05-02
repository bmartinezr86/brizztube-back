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

  /**
   * get all status
   * @returns
   */
  getStatus() {
    const endpoint = `${base_url}/user-status`;
    return this.http.get(endpoint);
  }

  /**
   * get all roles
   * @returns
   */
  getRoles() {
    const endpoint = `${base_url}/roles`;
    return this.http.get(endpoint);
  }

  /**
   * save the users
   */
  saveUser(body: any) {
    const endpoint = `${base_url}/users`;
    return this.http.post(endpoint, body);
  }
}
