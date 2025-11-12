import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventsService, Event } from '../../services/events.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  isAdmin: boolean = false;
  showEditForm: boolean = false;
  loading: boolean = true;
  error: string | null = null;
  
  editForm = {
    name: '',
    description: '',
    location: '',
    address: '',
    dates: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('EventDetailsComponent: Initializing...');
    this.loading = true;
    this.error = null;
    
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser?.role === 'admin';
    console.log('Current user:', currentUser);
    
    const eventId = this.route.snapshot.paramMap.get('id');
    console.log('Event ID from URL:', eventId);
    
    if (!eventId) {
      console.error('No event ID in URL!');
      this.loading = false;
      this.error = 'ID evenement manquant';
      return;
    }
    
    console.log('Calling API with ID:', eventId);
    this.eventsService.getEventByIdFromAPI(eventId).subscribe({
      next: (event) => {
        console.log('Event loaded successfully:', event.name);
        this.event = event;
        this.loading = false;
        this.error = null;
        
        this.editForm = {
          name: event.name,
          description: event.activities || event.description || '',
          location: event.location || '',
          address: event.address || '',
          dates: event.dates || ''
        };
        
        this.cdr.detectChanges();
        console.log('Event details loaded');
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.event = null;
        this.loading = false;
        this.error = 'Erreur lors du chargement';
        this.cdr.detectChanges();
      }
    });
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }

  saveEvent(): void {
    if (!this.event || !this.isAdmin) return;
    
    this.event.name = this.editForm.name;
    this.event.description = this.editForm.description;
    this.event.address = this.editForm.address;
    this.event.dates = this.editForm.dates;
    
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const updateRequest = {
        name: this.editForm.name,
        activities: this.editForm.description,
        address: this.editForm.address
      };
      this.eventsService.updateEvent(this.event.id, updateRequest, currentUser.id).subscribe({
        next: () => {
          alert('Evenement modifie avec succes !');
          this.showEditForm = false;
        },
        error: (error) => {
          console.error('Error updating event:', error);
          alert('Erreur lors de la modification');
        }
      });
    }
    
    this.showEditForm = false;
  }

  cancelEdit(): void {
    if (this.event) {
      this.editForm = {
        name: this.event.name,
        description: this.event.description || '',
        location: this.event.location || '',
        address: this.event.address || '',
        dates: this.event.dates || ''
      };
    }
    this.showEditForm = false;
  }

  deleteEvent(): void {
    if (!this.event || !this.isAdmin) return;
    
    const confirmDelete = confirm(`⚠️ Êtes-vous sûr de vouloir supprimer l'événement "${this.event.name}" ?\n\nCette action est irréversible !`);
    
    if (!confirmDelete) return;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('❌ Vous devez être connecté');
      return;
    }
    
    this.eventsService.deleteEvent(this.event.id, currentUser.id).subscribe({
      next: () => {
        alert('✅ Événement supprimé avec succès !');
        this.router.navigate(['/events']);
      },
      error: (error: any) => {
        console.error('Error deleting event:', error);
        const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
        alert(`❌ Erreur lors de la suppression: ${errorMsg}`);
      }
    });
  }

  goToAccommodation(): void {
    if (!this.event) return;
    
    console.log('Navigation vers hebergements pour:', this.event.name, 'a', this.event.location);
    
    this.router.navigate(['/accommodations'], {
      queryParams: { city: this.event.location }
    });
  }

  goToCarpooling(): void {
    console.log('Navigation vers covoiturage pour:', this.event?.name);
    alert('Covoiturages pour ' + this.event?.name + ' a ' + this.event?.location + '\n\nFonctionnalite en cours de developpement...');
  }

  openGoogleMaps(address: string): void {
    if (!address) {
      alert('Adresse non disponible');
      return;
    }
    
    // Encoder l'adresse pour l'URL
    const encodedAddress = encodeURIComponent(address);
    
    // Ouvrir Google Maps dans un nouvel onglet
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
    
    console.log('Opening Google Maps for address:', address);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}
