import { Injectable } from '@angular/core';

export interface Accommodation {
  id: number;
  name: string;
  address: string;
  city: string;
  availableSpots: number;
  totalSpots: number;
  description?: string;
  contactEmail?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private accommodations: Accommodation[] = [
    // Exemples d'hébergements
    { id: 1, name: 'Résidence Polytech Lyon', address: '15 Rue de la République', city: 'Lyon', availableSpots: 3, totalSpots: 10, description: 'Appartement T3 proche du campus', contactEmail: 'contact@polylyon.fr' },
    { id: 2, name: 'Studio Centre Paris', address: '8 Avenue des Champs', city: 'Paris', availableSpots: 1, totalSpots: 2, description: 'Studio confortable en centre-ville', contactEmail: 'paris@polytech.fr' },
    { id: 3, name: 'Colocation Saclay', address: '22 Rue du Campus', city: 'Saclay', availableSpots: 2, totalSpots: 5, description: 'Colocation étudiante', contactEmail: 'saclay@polytech.fr' },
    { id: 4, name: 'Appartement Lille Centre', address: '10 Place du Théâtre', city: 'Lille', availableSpots: 4, totalSpots: 6, description: 'Grand appartement partagé', contactEmail: 'lille@polytech.fr' },
    { id: 5, name: 'Logement Marseille Vieux Port', address: '5 Quai du Port', city: 'Marseille', availableSpots: 0, totalSpots: 4, description: 'Vue sur le Vieux Port', contactEmail: 'marseille@polytech.fr' },
    { id: 6, name: 'Studio Nantes', address: '12 Rue Crébillon', city: 'Nantes', availableSpots: 1, totalSpots: 1, description: 'Petit studio cosy', contactEmail: 'nantes@polytech.fr' },
    { id: 7, name: 'Résidence Grenoble', address: '30 Avenue Alsace-Lorraine', city: 'Grenoble', availableSpots: 5, totalSpots: 8, description: 'Proche des montagnes', contactEmail: 'grenoble@polytech.fr' },
    { id: 8, name: 'Appartement Tours', address: '7 Rue Nationale', city: 'Tours', availableSpots: 2, totalSpots: 3, description: 'Centre historique', contactEmail: 'tours@polytech.fr' }
  ];

  constructor() { }

  getAllAccommodations(): Accommodation[] {
    return this.accommodations;
  }

  getAccommodationById(id: number): Accommodation | undefined {
    return this.accommodations.find(acc => acc.id === id);
  }

  getAccommodationsByCity(city: string): Accommodation[] {
    return this.accommodations.filter(acc => 
      acc.city.toLowerCase() === city.toLowerCase()
    );
  }

  getAvailableCities(): string[] {
    const cities = [...new Set(this.accommodations.map(acc => acc.city))];
    return cities.sort();
  }

  addAccommodation(accommodation: Omit<Accommodation, 'id'>): Accommodation {
    const newId = Math.max(...this.accommodations.map(a => a.id), 0) + 1;
    const newAccommodation: Accommodation = {
      ...accommodation,
      id: newId
    };
    this.accommodations.push(newAccommodation);
    return newAccommodation;
  }

  updateAccommodation(id: number, updates: Partial<Accommodation>): boolean {
    const index = this.accommodations.findIndex(acc => acc.id === id);
    if (index !== -1) {
      this.accommodations[index] = { ...this.accommodations[index], ...updates };
      return true;
    }
    return false;
  }

  deleteAccommodation(id: number): boolean {
    const index = this.accommodations.findIndex(acc => acc.id === id);
    if (index !== -1) {
      this.accommodations.splice(index, 1);
      return true;
    }
    return false;
  }
}
