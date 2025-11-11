import { Injectable } from '@angular/core';

export interface Event {
  id: number;
  name: string;
  location: string;
  dates: string;
  month: string;
  color: string;
  description: string;
  lat?: number;
  lng?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private events: Event[] = [
    // Septembre
    { id: 1, name: 'WEC SAVOIE', location: 'Savoie', dates: '12-14', month: 'Septembre', color: '#FF00FF', description: 'Week-End de Cohésion à Savoie', lat: 45.5, lng: 6.5 },
    { id: 2, name: 'WEC SACLAY', location: 'Saclay', dates: '19-21', month: 'Septembre', color: '#FFFF00', description: 'Week-End de Cohésion à Saclay', lat: 48.7308, lng: 2.1756 },
    
    // Octobre
    { id: 3, name: 'SALMON', location: 'Angers', dates: '4-5', month: 'Octobre', color: '#FFA07A', description: 'Soirée Salmon', lat: 47.4784, lng: -0.5632 },
    { id: 4, name: 'MNMS', location: 'Marseille', dates: '18-19', month: 'Octobre', color: '#4169E1', description: 'MNMS Event', lat: 43.2965, lng: 5.3698 },
    
    // Novembre
    { id: 5, name: 'DISCOUNT', location: 'Clermont-Ferrand', dates: '8-9', month: 'Novembre', color: '#00FF7F', description: 'Soirée Discount', lat: 45.7772, lng: 3.0870 },
    { id: 6, name: 'DERRBY', location: 'Saclay', dates: '15-16', month: 'Novembre', color: '#FFFF00', description: 'Derrby Racing Event', lat: 48.7308, lng: 2.1756 },
    { id: 7, name: 'PURRPLE', location: 'Tours', dates: '22-23', month: 'Novembre', color: '#8B00FF', description: 'Soirée Purrple', lat: 47.3941, lng: 0.6848 },
    { id: 8, name: 'RRED', location: 'Lille', dates: '29-30', month: 'Novembre', color: '#DC143C', description: 'RRED Party', lat: 50.6292, lng: 3.0573 },
    
    // Décembre
    { id: 9, name: 'CONGRES', location: 'Orléans', dates: '5-7', month: 'Décembre', color: '#00CED1', description: 'Congrès National Polytech', lat: 47.9029, lng: 1.9093 },
    
    // Janvier
    { id: 10, name: 'TPW', location: 'Nantes', dates: '17-18', month: 'Janvier', color: '#FFFF00', description: 'The Polytech Week', lat: 47.2184, lng: -1.5536 },
    { id: 11, name: 'PINK', location: 'Annecy', dates: '24-25', month: 'Janvier', color: '#FF69B4', description: 'Pink Party', lat: 45.8992, lng: 6.1294 },
    { id: 12, name: 'INTERRLISTE', location: 'Orléans', dates: 'TBD', month: 'Janvier', color: '#FF8C00', description: 'Soirée Interrliste', lat: 47.9029, lng: 1.9093 },
    
    // Février
    { id: 13, name: 'WHITE', location: 'Grenoble', dates: '7-8', month: 'Février', color: '#F5F5F5', description: 'White Party', lat: 45.1885, lng: 5.7245 },
    { id: 14, name: 'BLUE', location: 'Montpellier', dates: '21-22', month: 'Février', color: '#1E90FF', description: 'Blue Night', lat: 43.6108, lng: 3.8767 },
    { id: 15, name: 'GONE', location: 'Lyon', dates: '28-29', month: 'Février', color: '#8B0000', description: 'Gone Party', lat: 45.7640, lng: 4.8357 },
    
    // Mars
    { id: 16, name: 'CAMPAGNES SACLAY', location: 'Saclay', dates: 'TBD', month: 'Mars', color: '#FFA500', description: 'Campagnes Saclay', lat: 48.7308, lng: 2.1756 },
    { id: 17, name: 'TIGRRESSES', location: 'Orléans', dates: '14-15', month: 'Mars', color: '#FF8C00', description: 'Soirée Tigrresses', lat: 47.9029, lng: 1.9093 },
    { id: 18, name: 'GS', location: 'Paris', dates: '28-29', month: 'Mars', color: '#A9A9A9', description: 'Grande Soirée', lat: 48.8566, lng: 2.3522 },
    
    // Avril
    { id: 19, name: 'POLYSOUND', location: 'Nancy', dates: '4-5', month: 'Avril', color: '#DC143C', description: 'Festival PolySound', lat: 48.6921, lng: 6.1844 },
    
    // Mai
    { id: 20, name: 'AG', location: 'Tours', dates: '8-10', month: 'Mai', color: '#00CED1', description: 'Assemblée Générale', lat: 47.3941, lng: 0.6848 }
  ];

  constructor() { }

  getAllEvents(): Event[] {
    return this.events;
  }

  getEventById(id: number): Event | undefined {
    return this.events.find(event => event.id === id);
  }

  getEventsByLocation(location: string): Event[] {
    return this.events.filter(event => 
      event.location.toLowerCase() === location.toLowerCase()
    );
  }

  getEventsByMonth(month: string): Event[] {
    return this.events.filter(event => event.month === month);
  }

  // Grouper les événements par ville pour la carte
  getEventsGroupedByLocation(): Map<string, Event[]> {
    const grouped = new Map<string, Event[]>();
    this.events.forEach(event => {
      const locationEvents = grouped.get(event.location) || [];
      locationEvents.push(event);
      grouped.set(event.location, locationEvents);
    });
    return grouped;
  }
}
