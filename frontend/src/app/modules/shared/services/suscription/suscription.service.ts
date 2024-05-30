import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

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

  suscribe(body: any): Observable<any> {
    const endpoint = `${base_url}/subscribe`;
    return this.http.post(endpoint, body);
  }

  unsuscribe(suscriberId: any, suscribedTo: any): Observable<any> {
    const endpoint = `${base_url}/unsubscribe/${suscriberId}/${suscribedTo}`;
    return this.http.delete(endpoint);
  }

  checkSubscription(
    subscriberId: number,
    subscribedToId: number
  ): Observable<boolean> {
    const url = `${base_url}/check/${subscriberId}/${subscribedToId}`;
    return this.http.get<boolean>(url).pipe(
      catchError((error) => {
        const errorMessage =
          'Error al verificar la suscripción: ' + error.message;
        return throwError(errorMessage);
      })
    );
  }
}
interface SuscribeRequest {
  suscriberId: number;
  suscribedTo: number;
}
