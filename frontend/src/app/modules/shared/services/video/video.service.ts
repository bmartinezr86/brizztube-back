import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api/videos';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private http: HttpClient) {}

  searchVideoByUserId(id: any) {
    const endpoint = `${base_url}/filter/user/${id}`;
    return this.http.get(endpoint);
  }

  searchVideoById(id: any) {
    const endpoint = `${base_url}/filter/id/${id}`;
    return this.http.get(endpoint);
  }
}
