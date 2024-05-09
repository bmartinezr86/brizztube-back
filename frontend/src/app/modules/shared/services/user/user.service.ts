import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserKey = 'currentUser';
  private currentPictureUserKey = 'currentPictureUser';
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

  /**
   * cookie
   */
  getCurrentUser(): any {
    const cookieValue = this.getCookie(this.currentUserKey);
    return cookieValue ? JSON.parse(cookieValue) : null;
  }

  setCurrentUser(user: any): void {
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      // picture: user.picture,
      password: user.password,
      rol: user.rol,
      status: user.status,
    };

    const pictureData = {
      picture: user.picture,
    };
    console.log('User to set:', userData);
    this.setCookie(this.currentUserKey, JSON.stringify(userData), 365); // Caduca en 1 año
    // this.setCookie(
    //   this.currentPictureUserKey,
    //   JSON.stringify(pictureData),
    //   365
    // ); // Caduca en 1 año
  }

  logoutUser(): void {
    this.deleteCookie(this.currentUserKey);
  }

  // Methods to work with cookies
  private setCookie(name: string, value: string, expireDays: number): void {
    const date = new Date();
    date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private getCookie(name: string): string | null {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  }
}
