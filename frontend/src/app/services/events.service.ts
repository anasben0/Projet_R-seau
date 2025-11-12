import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Event {
  id: string;  // UUID
  schoolId?: string;
  schoolName?: string;
  name: string;
  activities?: string;
  startsAt?: string;
  endsAt?: string;
  address: string;
  room?: string;
  createdBy?: string;
  createdByName?: string;
  createdAt?: string;
  // Propriétés calculées pour compatibilité
  location?: string;  // Nom de l'école pour filtrage
  dates?: string;
  month?: string;
  color?: string;
  description?: string;
  // Coordonnées GPS (calculées depuis schoolName)
  lat?: number;
  lng?: number;
}

export interface UpdateEventRequest {
  name?: string;
  activities?: string;
  startsAt?: string;
  endsAt?: string;
  address?: string;
  room?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = 'http://localhost:8080/api/events';

  // Coordonnées GPS des écoles Polytech
  private schoolCoordinates: { [key: string]: { lat: number, lng: number } } = {
    'Paris-Saclay': { lat: 48.7125, lng: 2.2050 },
    'Angers': { lat: 47.4784, lng: -0.5632 },
    'Annecy-Chambery': { lat: 45.6442, lng: 5.9180 },
    'Clermont': { lat: 45.7597, lng: 3.1119 },
    'Dijon': { lat: 47.3220, lng: 5.0415 },
    'Grenoble': { lat: 45.1885, lng: 5.7245 },
    'Lille': { lat: 50.6092, lng: 3.1367 },
    'Lyon': { lat: 45.7825, lng: 4.8742 },
    'Marseille': { lat: 43.2965, lng: 5.3698 },
    'Montpellier': { lat: 43.6108, lng: 3.8767 },
    'Nancy': { lat: 48.6880, lng: 6.1778 },
    'Nantes': { lat: 47.2484, lng: -1.5518 },
    'Nice Sophia': { lat: 43.6154, lng: 7.0719 },
    'Orléans': { lat: 47.9027, lng: 1.9086 },
    'Sorbonne': { lat: 48.8463, lng: 2.3564 },
    'Tours': { lat: 47.3670, lng: 0.7006 }
  };

  constructor(private http: HttpClient) { }

  // Méthodes HTTP - les vraies méthodes à utiliser
  getAllEventsFromAPI(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      map(events => events.map(event => this.enrichEvent(event)))
    );
  }

  getEventByIdFromAPI(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`).pipe(
      map(event => this.enrichEvent(event))
    );
  }

  updateEvent(eventId: string, request: UpdateEventRequest, userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${eventId}?userId=${userId}`, request);
  }

  deleteEvent(eventId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${eventId}?userId=${userId}`);
  }

  // Enrichir l'événement avec des propriétés calculées
  private enrichEvent(event: any): Event {
    // Utiliser le nom de l'école comme "location" pour le filtrage des hébergements
    // Les hébergements sont liés à une école via l'événement, pas à une ville
    const schoolLocation = event.schoolName || '';
    
    // Obtenir les coordonnées GPS depuis le nom de l'école
    const coordinates = this.schoolCoordinates[schoolLocation] || null;
    
    // Formater les dates
    const startDate = event.startsAt ? new Date(event.startsAt) : null;
    const endDate = event.endsAt ? new Date(event.endsAt) : null;
    
    const dates = startDate && endDate 
      ? `${startDate.getDate()}-${endDate.getDate()}` 
      : 'TBD';
    
    const month = startDate 
      ? startDate.toLocaleDateString('fr-FR', { month: 'long' }).charAt(0).toUpperCase() + 
        startDate.toLocaleDateString('fr-FR', { month: 'long' }).slice(1)
      : '';
    
    // Couleur basée sur le nom de l'école ou de l'événement
    const color = this.getEventColor(event.name, event.schoolName);
    
    return {
      ...event,
      location: schoolLocation, // Le nom de l'école pour le filtre des hébergements
      lat: coordinates?.lat,
      lng: coordinates?.lng,
      dates,
      month,
      color,
      description: event.activities || event.name
    };
  }

  // Assigner une couleur basée sur le nom
  private getEventColor(eventName: string, schoolName?: string): string {
    const colorMap: { [key: string]: string } = {
      'WEC': '#FF00FF',
      'SALMON': '#FFA07A',
      'MNMS': '#4169E1',
      'DISCOUNT': '#00FF7F',
      'DERRBY': '#FFFF00',
      'PURRPLE': '#8B00FF',
      'RRED': '#DC143C',
      'CONGRES': '#00CED1',
      'TPW': '#FFFF00',
      'PINK': '#FF69B4',
      'INTERRLISTE': '#FF8C00',
      'WHITE': '#F5F5F5',
      'BLUE': '#1E90FF',
      'GONE': '#8B0000',
      'CAMPAGNES': '#FFA500',
      'TIGRRESSES': '#FF8C00',
      'GS': '#A9A9A9',
      'POLYSOUND': '#DC143C',
      'AG': '#00CED1'
    };
    
    for (const key in colorMap) {
      if (eventName.includes(key)) {
        return colorMap[key];
      }
    }
    
    return '#667eea'; // Couleur par défaut
  }

  // Méthodes de filtrage
  getEventsByLocation(events: Event[], location: string): Event[] {
    return events.filter(event => 
      event.location?.toLowerCase() === location.toLowerCase()
    );
  }

  getEventsByMonth(events: Event[], month: string): Event[] {
    return events.filter(event => event.month === month);
  }

  // Grouper les événements par ville pour la carte
  getEventsGroupedByLocation(events: Event[]): Map<string, Event[]> {
    const grouped = new Map<string, Event[]>();
    events.forEach(event => {
      const location = event.location || 'Autre';
      const locationEvents = grouped.get(location) || [];
      locationEvents.push(event);
      grouped.set(location, locationEvents);
    });
    return grouped;
  }
}
