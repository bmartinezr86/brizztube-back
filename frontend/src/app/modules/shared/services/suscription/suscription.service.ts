import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = 'http://localhost:8080/api/suscriptions';

@Injectable({
  providedIn: 'root',
})
export class SuscriptionService {
  private currentUser = null;
  constructor(private http: HttpClient) {}

  /**
   *  saca el conteo de las suscripciones de un usuario
   * @param id
   * @returns
   */
  countSuscribers(id: any) {
    const endpoint = `${base_url}/countSubscribers/${id}`;
    return this.http.get(endpoint);
  }

  suscribe(suscriberId: any, suscribedTo: any) {
    const body: SuscribeRequest = { suscriberId, suscribedTo };
    const endpoint = `${base_url}/subscribe`;
    return this.http.put(endpoint, body);
  }

  unsuscribe(suscriberId: any, suscribedTo: any) {
    const endpoint = `${base_url}/unsuscribe/ ${suscriberId}/${suscribedTo}`;
    return this.http.delete(endpoint);
  }
}

interface SuscribeRequest {
  suscriberId: number;
  suscribedTo: number;
}
