import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventsService, Event } from '../../services/events.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  selectedMonth: string = 'Tous';
  months: string[] = ['Tous', 'Septembre', 'Octobre', 'Novembre', 'Décembre', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai'];

  constructor(
    private router: Router,
    private eventsService: EventsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🔵 EventsComponent: Loading events from API...');
    // Charger les événements depuis l'API
    this.eventsService.getAllEventsFromAPI().subscribe({
      next: (events) => {
        console.log(`✅ EventsComponent: Loaded ${events.length} events`);
        this.events = events;
        this.filteredEvents = events;
        // Forcer la détection de changement
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading events:', error);
        alert('❌ Erreur lors du chargement des événements');
      }
    });
  }

  filterByMonth(month: string): void {
    this.selectedMonth = month;
    if (month === 'Tous') {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.eventsService.getEventsByMonth(this.events, month);
    }
  }

  viewEventDetails(event: Event): void {
    console.log(`🔵 Navigating to event details: ${event.name} (ID: ${event.id})`);
    // Navigation vers la page de détails de l'événement
    this.router.navigate(['/events', event.id]);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
