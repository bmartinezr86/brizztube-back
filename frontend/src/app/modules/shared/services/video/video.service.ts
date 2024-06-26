import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map } from 'rxjs';

const base_url = 'http://localhost:8080/api/videos';

const base_url_likes = 'http://localhost:8080/api/likes';
const base_url_categories = 'http://localhost:8080/api/categories';
const base_url_views = 'http://localhost:8080/api/views';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  videosHome: BehaviorSubject<any> = new BehaviorSubject([]);
  private searchState = new BehaviorSubject<{
    showSearchResults: boolean;
    noResultsFound: boolean;
  }>({ showSearchResults: false, noResultsFound: false });

  constructor(private http: HttpClient) {}

  search() {
    const endpoint = `${base_url}/`;
    return this.http.get(endpoint);
  }
  searchVideoByUserId(id: any) {
    const endpoint = `${base_url}/filter/user/${id}`;
    return this.http.get(endpoint);
  }

  searchVideoByCategoryId(id: any) {
    const endpoint = `${base_url}/filter/category/${id}`;
    return this.http.get<any[]>(endpoint);
  }

  searchVideoById(id: any): Observable<any> {
    const endpoint = `${base_url}/filter/id/${id}`;
    return this.http.get(endpoint);
  }

  like(body: any) {
    const endpoint = `${base_url_likes}/like`;
    return this.http.post(endpoint, body);
  }

  unlike(videoId: any, userId: any) {
    const endpoint = `${base_url_likes}/unlike/${videoId}/${userId}`;
    return this.http.delete(endpoint);
  }

  registerView(body: any) {
    const endpoint = `${base_url_views}/register-view`;
    return this.http.post(endpoint, body);
  }

  setVideosHome(videos: any) {
    this.videosHome.next(videos);
  }

  getVideosHome() {
    return this.videosHome.asObservable();
  }

  setSearchState(state: {
    showSearchResults: boolean;
    noResultsFound: boolean;
  }) {
    this.searchState.next(state);
  }

  getSearchState(): Observable<{
    showSearchResults: boolean;
    noResultsFound: boolean;
  }> {
    return this.searchState.asObservable();
  }

  getVideosByFilter(filter: string) {
    const endpoint = `${base_url}/filter/title/${filter}`;
    return this.http.get(endpoint);
  }

  uploadVideo(formData: FormData): Observable<any> {
    const endpoint = `${base_url}/upload`;

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post(endpoint, formData, {
      reportProgress: true, // Habilita la información de progreso
      observe: 'events', // Observa los eventos de progreso
      headers: headers, // Agrega los encabezados adecuados
    });
  }

  saveDetailsVideo(body: any, id: any) {
    const endpoint = `${base_url}/saveDetails/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * get all status
   * @returns
   */
  getCategories() {
    const endpoint = `${base_url_categories}/`;
    return this.http.get(endpoint);
  }

  deleteVideo(id: any) {
    const endpoint = `${base_url}/delete/${id}`;
    return this.http.delete(endpoint);
  }

  getSubsVideosUser(userId: any) {
    const endpoint = `${base_url}/following/${userId}`;
    return this.http.get<any[]>(endpoint);
  }
}

interface LikeRequest {
  videoId: number;
  userId: number;
}
