import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const base_url = 'http://localhost:8080/api/videos';

const base_url_likes = 'http://localhost:8080/api/likes';

@Injectable({
  providedIn: 'root',
})
export class VideoService {

  videosHome: BehaviorSubject<any> = new BehaviorSubject([])

  constructor(private http: HttpClient) {}

  search() {
    const endpoint = `${base_url}/`;
    return this.http.get(endpoint);
  }
  searchVideoByUserId(id: any) {
    const endpoint = `${base_url}/filter/user/${id}`;
    return this.http.get(endpoint);
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

  setVideosHome(videos: any){
    this.videosHome.next(videos);
  }

  getVideosHome(){
    return this.videosHome.asObservable();
  }


  getVideosByFilter(filter: string){
    const endpoint = `${base_url}/filter/title/${filter}`;
    return this.http.get(endpoint);
  }


}

interface LikeRequest {
  videoId: number;
  userId: number;
}
