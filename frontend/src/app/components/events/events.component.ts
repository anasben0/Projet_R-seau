import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService, Event } from '../../services/events.service';
import { AuthService } from '../../services/auth.service';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  selectedMonth: string = 'Tous';
  months: string[] = ['Tous', 'Septembre', 'Octobre', 'Novembre', 'Décembre', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai'];
  
  // Admin features
  currentUser: any = null;
  isAdmin: boolean = false;
  showCreateForm: boolean = false;
  schools: any[] = [];
  
  // Formulaire de création
  newEvent: any = {
    schoolId: '',
    name: '',
    activities: '',
    startsAt: '',
    endsAt: '',
    address: '',
    room: ''
  };

  constructor(
    private router: Router,
    private eventsService: EventsService,
    private authService: AuthService,
    private schoolService: SchoolService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🔵 EventsComponent: Loading events from API...');
    
    // Vérifier si l'utilisateur est admin
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'admin' || this.currentUser?.email === 'dev@polyrezo.com';
    
    // Charger les écoles si admin
    if (this.isAdmin) {
      this.loadSchools();
    }
    
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
  
  loadSchools(): void {
    this.schoolService.getAllSchools().subscribe({
      next: (schools: any) => {
        this.schools = schools;
      },
      error: (error: any) => {
        console.error('Error loading schools:', error);
      }
    });
  }
  
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }
  
  resetForm(): void {
    this.newEvent = {
      schoolId: '',
      name: '',
      activities: '',
      startsAt: '',
      endsAt: '',
      address: '',
      room: ''
    };
  }
  
  createEvent(): void {
    if (!this.newEvent.schoolId || !this.newEvent.name || !this.newEvent.startsAt || !this.newEvent.address) {
      alert('❌ Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Convertir les dates en format ISO
    const eventData = {
      schoolId: this.newEvent.schoolId,
      name: this.newEvent.name,
      activities: this.newEvent.activities,
      startsAt: new Date(this.newEvent.startsAt).toISOString(),
      endsAt: this.newEvent.endsAt ? new Date(this.newEvent.endsAt).toISOString() : null,
      address: this.newEvent.address,
      room: this.newEvent.room
    };
    
    this.eventsService.createEvent(eventData, this.currentUser.id).subscribe({
      next: (event: any) => {
        alert('✅ Événement créé avec succès !');
        this.showCreateForm = false;
        this.resetForm();
        // Recharger les événements
        this.ngOnInit();
      },
      error: (error: any) => {
        console.error('Error creating event:', error);
        const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
        alert(`❌ Erreur lors de la création de l'événement: ${errorMsg}`);
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
