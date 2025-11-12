import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  availableEvents: any[] = []; // Liste des événements disponibles
  newAccommodation = {
    title: '',
    description: '',  // Nouvelle propriété pour la description
    address: '',
    city: '',
    capacity: 1,
    contact: '',  // Sera rempli automatiquement avec l'email/phone de l'utilisateur
    eventId: ''
  };

  constructor(
    private accommodationService: AccommodationService,
    private authService: AuthService,
    private eventsService: EventsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('AccommodationsComponent - ngOnInit called');
    console.log('AccommodationsComponent - User authenticated:', this.authService.isAuthenticated());
    console.log('AccommodationsComponent - Current user:', this.authService.getCurrentUser());
    
    this.checkAdminStatus();
    
    // Charger les événements pour le sélecteur
    this.loadEvents();
    
    // Charger les hébergements une fois
    this.loadAccommodations();
    
    // Vérifier si une ville est passée en query parameter (après le chargement)
    this.route.queryParams.subscribe(params => {
      const cityParam = params['city'];
      if (cityParam) {
        console.log('City filter from query params:', cityParam);
        this.selectedCity = cityParam;
        // Réappliquer les filtres si les données sont déjà chargées
        if (this.accommodations.length > 0) {
          this.applyFilters();
        }
      }
    });
  }

  loadAccommodations(): void {
    console.log('Loading accommodations from backend...');
    this.accommodationService.getAllAccommodations().subscribe({
      next: (accommodations) => {
        console.log('Accommodations received from backend:', accommodations);
        console.log('First accommodation acceptedGuests:', accommodations[0]?.acceptedGuests);
        this.accommodations = [...accommodations]; // Créer une nouvelle référence
        this.loadAvailableCities();
        
        // Afficher un message si la ville filtrée n'a pas d'hébergements
        if (this.selectedCity !== 'Toutes' && !this.availableCities.includes(this.selectedCity)) {
          console.warn('Ville non trouvée dans les hébergements disponibles:', this.selectedCity);
          alert(`ℹ️ Aucun hébergement disponible pour ${this.selectedCity} pour le moment.\n\nAffichage de tous les hébergements disponibles.`);
          this.selectedCity = 'Toutes';
        }
        
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
    // Extraire les noms d'écoles uniques depuis les hébergements
    const schoolsFromAccommodations = [...new Set(
      this.accommodations
        .map(acc => acc.schoolName)
        .filter(school => school && school.trim())
    )] as string[];
    
    // Trier et ajouter "Toutes" en premier
    this.availableCities = ['Toutes', ...schoolsFromAccommodations].sort((a, b) => {
      if (a === 'Toutes') return -1;
      if (b === 'Toutes') return 1;
      return a.localeCompare(b);
    });
    
    console.log('Available cities loaded:', this.availableCities);
  }

  loadEvents(): void {
    console.log('Loading events for accommodation form...');
    this.eventsService.getAllEventsFromAPI().subscribe({
      next: (events) => {
        console.log('Events loaded:', events);
        this.availableEvents = events;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.availableEvents = [];
      }
    });
  }

  checkAdminStatus(): void {
    const user = this.authService.getCurrentUser();
    // Permettre à tous les utilisateurs authentifiés de créer des hébergements
    this.isAdmin = this.authService.isAuthenticated();
  }

  filterByCity(city: string): void {
    this.selectedCity = city;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    console.log('Applying filters - Selected city:', this.selectedCity, 'Search query:', this.searchQuery);
    let filtered = [...this.accommodations]; // Créer une copie

    // Filtre par école (utilise schoolName)
    if (this.selectedCity !== 'Toutes') {
      filtered = filtered.filter(acc => {
        const matches = acc.schoolName === this.selectedCity;
        console.log(`Checking ${acc.title}: schoolName="${acc.schoolName}", matches=${matches}`);
        return matches;
      });
    }

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(acc =>
        acc.title.toLowerCase().includes(query) ||
        acc.address.toLowerCase().includes(query) ||
        (acc.schoolName && acc.schoolName.toLowerCase().includes(query)) ||
        (acc.city && acc.city.toLowerCase().includes(query))
      );
    }

    this.filteredAccommodations = [...filtered]; // Nouvelle référence pour forcer le re-render
    console.log('Filters applied. Results:', this.filteredAccommodations.length);
    console.log('Filtered accommodations:', this.filteredAccommodations);
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    } else {
      // Remplir automatiquement le contact avec l'email et le téléphone de l'utilisateur
      const user = this.authService.getCurrentUser();
      if (user) {
        this.newAccommodation.contact = user.phone 
          ? `${user.email} / ${user.phone}` 
          : user.email;
      }
    }
  }

  addAccommodation(): void {
    if (this.validateForm()) {
      const user = this.authService.getCurrentUser();
      if (!user) {
        alert('❌ Vous devez être connecté pour ajouter un hébergement');
        return;
      }

      // Inclure l'eventId dans les données
      const accommodationData = {
        title: this.newAccommodation.title,
        address: this.newAccommodation.address,
        contact: this.newAccommodation.contact,
        capacity: Number(this.newAccommodation.capacity),
        eventId: this.newAccommodation.eventId || undefined  // Inclure l'événement sélectionné
      };

      console.log('Creating accommodation:', accommodationData);

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
      alert('❌ L\'adresse complète est requise');
      return false;
    }
    if (!this.newAccommodation.eventId) {
      alert('❌ Vous devez sélectionner un événement');
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
      description: '',
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

  viewDetails(accommodationId: string): void {
    this.router.navigate(['/accommodations', accommodationId]);
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
    const availableSpots = this.getAvailableSpots(accommodation);
    const ratio = availableSpots / accommodation.capacity;
    if (availableSpots === 0) return 'full';
    if (ratio < 0.3) return 'low';
    return 'available';
  }

  getAvailabilityText(accommodation: Accommodation): string {
    const availableSpots = this.getAvailableSpots(accommodation);
    if (availableSpots === 0) return 'Complet';
    if (availableSpots === 1) return '1 place disponible';
    return `${availableSpots} places disponibles`;
  }

  // Calcule les places disponibles en temps réel
  getAvailableSpots(accommodation: Accommodation): number {
    const acceptedCount = accommodation.acceptedGuests ?? 0;
    return accommodation.capacity - acceptedCount;
  }

  getTotalAvailableSpots(): number {
    return this.filteredAccommodations.reduce((sum, acc) => sum + acc.availableSpots, 0);
  }
}
