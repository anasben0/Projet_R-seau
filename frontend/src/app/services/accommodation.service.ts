import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Accommodation {
  id: string;  // UUID du backend
  eventId?: string;
  eventName?: string;
  hostId?: string;
  hostName?: string;
  title: string;  // Backend utilise "title" au lieu de "name"
  address: string;
  city: string;  // Sera extrait de l'adresse ou ajouté manuellement
  contact?: string;  // Backend utilise "contact" au lieu de "contactEmail"
  capacity: number;  // Backend utilise "capacity" au lieu de "totalSpots"
  availableSpots: number;
  acceptedGuests?: number;
  description?: string;
  createdAt?: string;
}

export interface AccommodationCreateRequest {
  eventId: string;
  title: string;
  address: string;
  contact?: string;
  capacity: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private apiUrl = 'http://localhost:8080/api/accommodations';

  constructor(private http: HttpClient) { }

  /**
   * Récupérer tous les hébergements
   */
  getAllAccommodations(): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(this.apiUrl).pipe(
      map(accommodations => accommodations.map(acc => this.enrichAccommodation(acc)))
    );
  }

  /**
   * Récupérer un hébergement par ID
   */
  getAccommodationById(id: string): Observable<Accommodation> {
    return this.http.get<Accommodation>(`${this.apiUrl}/${id}`).pipe(
      map(acc => this.enrichAccommodation(acc))
    );
  }

  /**
   * Récupérer les hébergements d'un événement
   */
  getAccommodationsByEvent(eventId: string): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(`${this.apiUrl}/event/${eventId}`).pipe(
      map(accommodations => accommodations.map(acc => this.enrichAccommodation(acc)))
    );
  }

  /**
   * Filtrer les hébergements par ville (côté client)
   */
  getAccommodationsByCity(accommodations: Accommodation[], city: string): Accommodation[] {
    return accommodations.filter(acc => 
      acc.city.toLowerCase() === city.toLowerCase()
    );
  }

  /**
   * Récupérer les villes disponibles
   */
  getAvailableCities(accommodations: Accommodation[]): string[] {
    const cities = [...new Set(accommodations.map(acc => acc.city))];
    return cities.sort();
  }

  /**
   * Créer un nouvel hébergement
   */
  addAccommodation(hostId: string, accommodation: AccommodationCreateRequest): Observable<Accommodation> {
    return this.http.post<Accommodation>(
      `${this.apiUrl}?hostId=${hostId}`, 
      accommodation
    ).pipe(
      map(acc => this.enrichAccommodation(acc))
    );
  }

  /**
   * Mettre à jour un hébergement
   */
  updateAccommodation(id: string, hostId: string, updates: Partial<AccommodationCreateRequest>): Observable<Accommodation> {
    return this.http.put<Accommodation>(
      `${this.apiUrl}/${id}?hostId=${hostId}`, 
      updates
    ).pipe(
      map(acc => this.enrichAccommodation(acc))
    );
  }

  /**
   * Supprimer un hébergement
   */
  deleteAccommodation(id: string, hostId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?hostId=${hostId}`);
  }

  /**
   * Enrichir un hébergement avec la ville extraite de l'adresse
   */
  private enrichAccommodation(acc: Accommodation): Accommodation {
    // Si la ville n'est pas définie, essayer de l'extraire de l'adresse
    if (!acc.city && acc.address) {
      acc.city = this.extractCityFromAddress(acc.address);
    }
    return acc;
  }

  /**
   * Extraire la ville d'une adresse (basique)
   */
  private extractCityFromAddress(address: string): string {
    // Format typique: "15 rue de la République, Lyon" ou "Lyon" en fin d'adresse
    const parts = address.split(',');
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
    
    // Villes connues de Polytech
    const knownCities = ['Lyon', 'Paris', 'Saclay', 'Lille', 'Marseille', 'Nantes', 
                         'Grenoble', 'Tours', 'Angers', 'Orléans', 'Montpellier', 
                         'Annecy', 'Clermont-Ferrand', 'Nancy', 'Nice'];
    
    for (const city of knownCities) {
      if (address.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
    
    return 'Ville inconnue';
  }
}
