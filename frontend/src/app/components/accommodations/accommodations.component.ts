import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccommodationService, Accommodation } from '../../services/accommodation.service';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-accommodations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.css']
})
export class AccommodationsComponent implements OnInit {
  accommodations: Accommodation[] = [];
  filteredAccommodations: Accommodation[] = [];
  selectedCity: string = 'Toutes';
  availableCities: string[] = [];
  searchQuery: string = '';
  
  // Admin - Ajout de logement
  showAddForm: boolean = false;
  isAdmin: boolean = false;
  newAccommodation = {
    title: '',
    address: '',
    city: '',
    capacity: 1,
    contact: '',
    eventId: ''  // Sera rempli avec le premier événement
  };

  constructor(
    private accommodationService: AccommodationService,
    private authService: AuthService,
    private eventsService: EventsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('AccommodationsComponent - ngOnInit called');
    console.log('AccommodationsComponent - User authenticated:', this.authService.isAuthenticated());
    console.log('AccommodationsComponent - Current user:', this.authService.getCurrentUser());
    
    this.checkAdminStatus();
    this.loadAccommodations();
  }

  loadAccommodations(): void {
    console.log('Loading accommodations from backend...');
    this.accommodationService.getAllAccommodations().subscribe({
      next: (accommodations) => {
        console.log('Accommodations received from backend:', accommodations);
        this.accommodations = [...accommodations]; // Créer une nouvelle référence
        this.loadAvailableCities();
        // Réappliquer les filtres après le chargement
        this.applyFilters();
        console.log('Accommodations loaded and filtered:', this.filteredAccommodations.length);
        console.log('Filtered accommodations:', this.filteredAccommodations);
        // Forcer la détection des changements
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading accommodations:', error);
        alert('❌ Erreur lors du chargement des hébergements');
        this.accommodations = [];
        this.filteredAccommodations = [];
      }
    });
  }

  loadAvailableCities(): void {
    // Récupérer les villes depuis les événements
    const events = this.eventsService.getAllEvents();
    const eventCities = [...new Set(events.map(e => e.location))];
    
    // Récupérer les villes avec des hébergements directement depuis le tableau
    const accommodationCities = [...new Set(this.accommodations.map(acc => acc.city))];
    
    // Combiner et dédupliquer
    this.availableCities = ['Toutes', ...new Set([...eventCities, ...accommodationCities])].sort();
  }

  checkAdminStatus(): void {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.email === 'dev@polyrezo.com' || user?.role === 'admin';
  }

  filterByCity(city: string): void {
    this.selectedCity = city;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.accommodations]; // Créer une copie

    // Filtre par ville
    if (this.selectedCity !== 'Toutes') {
      filtered = filtered.filter(acc => acc.city === this.selectedCity);
    }

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(acc =>
        acc.title.toLowerCase().includes(query) ||
        acc.address.toLowerCase().includes(query) ||
        acc.city.toLowerCase().includes(query)
      );
    }

    this.filteredAccommodations = [...filtered]; // Nouvelle référence pour forcer le re-render
    console.log('Filters applied. Results:', this.filteredAccommodations.length);
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  addAccommodation(): void {
    if (this.validateForm()) {
      const user = this.authService.getCurrentUser();
      if (!user) {
        alert('❌ Vous devez être connecté pour ajouter un hébergement');
        return;
      }

      // UUID de l'événement "Hébergements Polytech - Général" créé dans la base de données
      const generalEventId = '76d5acce-1e33-471d-8556-dcdb8ff85e19';

      const accommodationData = {
        eventId: generalEventId,
        title: this.newAccommodation.title,
        address: `${this.newAccommodation.address}, ${this.newAccommodation.city}`,
        contact: this.newAccommodation.contact,
        capacity: Number(this.newAccommodation.capacity)
      };

      this.accommodationService.addAccommodation(user.id, accommodationData).subscribe({
        next: (accommodation) => {
          alert(`✅ Hébergement "${accommodation.title}" ajouté avec succès !`);
          this.loadAccommodations();
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error) => {
          console.error('Error adding accommodation:', error);
          alert(`❌ Erreur lors de l'ajout de l'hébergement: ${error.error?.message || error.message}`);
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.newAccommodation.title.trim()) {
      alert('❌ Le titre est requis');
      return false;
    }
    if (!this.newAccommodation.address.trim()) {
      alert('❌ L\'adresse est requise');
      return false;
    }
    if (!this.newAccommodation.city.trim()) {
      alert('❌ La ville est requise');
      return false;
    }
    if (this.newAccommodation.capacity < 1) {
      alert('❌ La capacité doit être au moins 1');
      return false;
    }
    return true;
  }

  resetForm(): void {
    this.newAccommodation = {
      title: '',
      address: '',
      city: '',
      capacity: 1,
      contact: '',
      eventId: ''
    };
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  contactAccommodation(accommodation: Accommodation): void {
    if (accommodation.contact) {
      // Si c'est un email, ouvrir mailto
      if (accommodation.contact.includes('@')) {
        window.location.href = `mailto:${accommodation.contact}?subject=Demande d'hébergement - ${accommodation.title}`;
      } else {
        // Sinon afficher le numéro de téléphone
        alert(`📞 Contact: ${accommodation.contact}`);
      }
    } else {
      alert('📧 Aucun contact disponible pour cet hébergement');
    }
  }

  getAvailabilityClass(accommodation: Accommodation): string {
    const ratio = accommodation.availableSpots / accommodation.capacity;
    if (accommodation.availableSpots === 0) return 'full';
    if (ratio < 0.3) return 'low';
    return 'available';
  }

  getAvailabilityText(accommodation: Accommodation): string {
    if (accommodation.availableSpots === 0) return 'Complet';
    if (accommodation.availableSpots === 1) return '1 place disponible';
    return `${accommodation.availableSpots} places disponibles`;
  }

  getTotalAvailableSpots(): number {
    return this.filteredAccommodations.reduce((sum, acc) => sum + acc.availableSpots, 0);
  }
}
