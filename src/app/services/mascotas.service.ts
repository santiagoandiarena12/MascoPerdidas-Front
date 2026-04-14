import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export type EspecieMascota = 'Perro' | 'Gato' | 'Otro';

// Esta interfaz debe coincidir con lo que devuelve/recibe el backend en Java (los nombres de atributos en tu DTO/Entity)
export interface Mascota {
  id?: number;
  nombre: string;
  especie: EspecieMascota | string; 
  raza?: string;
  fotoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private readonly http = inject(HttpClient);
  // Por defecto apunta a http://localhost:8080/api/mascotas (modificá "/mascotas" si tu endpoint de Spring se llama distinto)
  private readonly apiUrl = `${environment.apiUrl}/mascotas`;

  /**
   * Obtiene la lista de mascotas del usuario.
   */
  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener mascotas:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Envía una nueva mascota al backend para guardarla.
   */
  crearMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.apiUrl, mascota).pipe(
      catchError(error => {
        console.error('Error al crear mascota:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Elimina una mascota en el backend.
   */
  eliminarMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar mascota:', error);
        return throwError(() => error);
      })
    );
  }
}
