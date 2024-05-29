import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api/playlists';
@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  constructor(private http: HttpClient) {}

  createPlaylist(body: any) {
    const endpoint = `${base_url}/create`;
    return this.http.post(endpoint, body);
  }

  addVideoToPlaylist(playlistId: any, videoId: any) {
    const endpoint = `${base_url}/${playlistId}/videos/${videoId}`;
    return this.http.post(endpoint, null);
  }

  removeVideoToPlaylist(playlistId: any, videoId: any) {
    const endpoint = `${base_url}/${playlistId}/videos/${videoId}`;
    return this.http.delete(endpoint);
  }

  deletePlaylist(playlistId: any) {
    const endpoint = `${base_url}/${playlistId}`;
    return this.http.delete(endpoint);
  }

  listVideosByPlaylistId(playlistId: any) {
    const endpoint = `${base_url}/${playlistId}/videos`;
    return this.http.get(endpoint);
  }

  listVideosByUserId(userId: any) {
    const endpoint = `${base_url}/user/${userId}`;
    return this.http.get(endpoint);
  }
}
