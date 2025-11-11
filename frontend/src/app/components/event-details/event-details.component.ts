import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventsService, Event } from '../../services/events.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'événement depuis l'URL
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Event ID from URL:', eventId);
    
    this.event = this.eventsService.getEventById(eventId) || null;
    console.log('Event found:', this.event);

    // Ne pas rediriger immédiatement, laisser le template gérer l'affichage d'erreur
  }

  goToAccommodation(): void {
    console.log('Navigation vers hébergements pour:', this.event?.name);
    // TODO: Implémenter la navigation vers la page hébergements
    alert(`🏠 Recherche d'hébergements pour ${this.event?.name} à ${this.event?.location}\n\nFonctionnalité en cours de développement...`);
  }

  goToCarpooling(): void {
    console.log('Navigation vers covoiturage pour:', this.event?.name);
    // TODO: Implémenter la navigation vers la page covoiturage
    alert(`🚗 Covoiturages pour ${this.event?.name} à ${this.event?.location}\n\nFonctionnalité en cours de développement...`);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}
