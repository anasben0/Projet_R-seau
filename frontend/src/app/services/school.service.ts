import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { School } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private apiUrl = 'http://localhost:8080/api/schools';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les écoles
   */
  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.apiUrl);
  }

  /**
   * Récupérer une école par ID
   */
  getSchoolById(id: string): Observable<School> {
    return this.http.get<School>(`${this.apiUrl}/${id}`);
  }
}
