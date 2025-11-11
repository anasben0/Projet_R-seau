import { Component, OnInit } from '@angular/core';
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
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.events = this.eventsService.getAllEvents();
    this.filteredEvents = this.events;
  }

  filterByMonth(month: string): void {
    this.selectedMonth = month;
    if (month === 'Tous') {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(event => event.month === month);
    }
  }

  viewEventDetails(event: Event): void {
    // Navigation vers la page de détails de l'événement
    this.router.navigate(['/events', event.id]);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
