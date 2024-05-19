import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser = null;
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
   * get user by id
   * @param id
   * @returns
   */
  getUserById(id: any) {
    const endpoint = `${base_url}/users/ ${id}`;
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
   * search user by name
   * @param name
   */
  getUserByName(name: any) {
    const endpoint = `${base_url}/users/filter/${name}`;
    return this.http.get(endpoint);
  }

  /**
   * save the users
   */
  saveUser(body: any) {
    const endpoint = `${base_url}/users`;
    return this.http.post(endpoint, body);
  }

  /**
   * update the user
   */
  updateUser(body: any, id: any) {
    const endpoint = `${base_url}/users/ ${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete the users
   */
  deleteUser(id: any) {
    const endpoint = `${base_url}/users/ ${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * login the users
   */
  loginUser(body: any) {
    const endpoint = `${base_url}/login`;
    return this.http.post(endpoint, body);
  }

  logoutUser(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  setCurrentUser(usuario: any): void {
    this.currentUser = usuario;
    if (usuario) {
      sessionStorage.setItem('currentUser', JSON.stringify(usuario));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): any {
    const storedUser = sessionStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  isLoggedIn(): boolean {
    // Verifica si la sesión existe
    return sessionStorage.getItem('currentUser') !== null;
  }

  getUserRole(): string {
    // Obtiene el rol del usuario desde el sessionStorage
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData).role;
    }
    return '';
  }
}
