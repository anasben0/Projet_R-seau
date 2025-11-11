import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventsService, Event } from '../../services/events.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, AfterViewInit {
  user: any = null;
  private map: any = null;
  private events: Event[] = [];

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.events = this.eventsService.getAllEvents();
  }

  ngAfterViewInit(): void {
    // Initialiser la carte seulement dans le navigateur
    if (isPlatformBrowser(this.platformId)) {
      // Importer Leaflet dynamiquement seulement côté client
      import('leaflet').then(L => {
        this.initMap(L.default);
      });
    }
  }

  private initMap(L: any): void {
    // Créer la carte centrée sur la France
    this.map = L.map('map').setView([46.603354, 1.888334], 6);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Créer une icône personnalisée pour les pins
    const customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Grouper les événements par ville
    const eventsGrouped = this.eventsService.getEventsGroupedByLocation();

    // Ajouter les marqueurs pour chaque ville qui a des événements
    eventsGrouped.forEach((cityEvents, locationName) => {
      // Prendre les coordonnées du premier événement de cette ville
      const firstEvent = cityEvents[0];
      if (!firstEvent.lat || !firstEvent.lng) return;

      const marker = L.marker([firstEvent.lat, firstEvent.lng], { icon: customIcon })
        .addTo(this.map!);

      // Créer la liste des événements pour le popup
      const eventsList = cityEvents.map(event => `
        <div style="
          padding: 8px;
          margin: 4px 0;
          background: ${event.color}22;
          border-left: 3px solid ${event.color};
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        " 
        onclick="window.dispatchEvent(new CustomEvent('navigateToEvent', { detail: ${event.id} }))">
          <strong>${event.name}</strong><br>
          <small>📆 ${event.dates} ${event.month}</small>
        </div>
      `).join('');

      // Ajouter un popup avec les informations de la ville
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 12px 0; color: #667eea; text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 8px;">
            📍 ${locationName}
          </h3>
          <p style="margin: 0 0 8px 0; color: #666; text-align: center;">
            <strong>${cityEvents.length}</strong> événement(s) à venir
          </p>
          <div style="max-height: 250px; overflow-y: auto;">
            ${eventsList}
          </div>
        </div>
      `, {
        maxWidth: 300
      });

      // Animation au survol
      marker.on('mouseover', function(this: any) {
        this.openPopup();
      });
    });

    // Écouter l'événement de navigation personnalisé
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('navigateToEvent', ((e: CustomEvent) => {
        const eventId = e.detail;
        this.router.navigate(['/events', eventId]);
      }) as EventListener);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
