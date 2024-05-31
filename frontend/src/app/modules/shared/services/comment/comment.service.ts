import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api/comments';
@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  // crea comentario
  create(body: any) {
    const endpoint = `${base_url}/save`;
    return this.http.post(endpoint, body);
  }

  // edita comentario
  modify(body: any, commentId: any) {
    const endpoint = `${base_url}/update/${commentId}`;
    return this.http.put(endpoint, body);
  }

  // elimina comentario
  delete(commentId: any) {
    const endpoint = `${base_url}/delete/${commentId}`;
    return this.http.delete(endpoint);
  }
  // listar comentarios de un video
  listCommentToVideoId(videoId: any) {
    const endpoint = `${base_url}/video/${videoId}`;
    return this.http.get(endpoint);
  }
}
