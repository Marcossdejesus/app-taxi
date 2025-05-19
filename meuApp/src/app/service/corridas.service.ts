import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorridasService {
  private apiUrl = 'http://localhost:3000/corridas';

  constructor(private http: HttpClient) {}

  listarCorridas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  adicionarCorrida(corrida: any) {
    return this.http.post(this.apiUrl, corrida);
  }

  editarCorrida(id: number | string, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }

  excluirCorrida(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}