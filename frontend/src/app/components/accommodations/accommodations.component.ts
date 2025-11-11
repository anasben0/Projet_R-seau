import { Component, OnInit } from '@angular/core';
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
    name: '',
    address: '',
    city: '',
    availableSpots: 1,
    totalSpots: 1,
    description: '',
    contactEmail: ''
  };

  constructor(
    private accommodationService: AccommodationService,
    private authService: AuthService,
    private eventsService: EventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('AccommodationsComponent - ngOnInit called');
    console.log('AccommodationsComponent - User authenticated:', this.authService.isAuthenticated());
    console.log('AccommodationsComponent - Current user:', this.authService.getCurrentUser());
    
    this.loadAccommodations();
    this.checkAdminStatus();
    this.loadAvailableCities();
  }

  loadAccommodations(): void {
    this.accommodations = this.accommodationService.getAllAccommodations();
    this.filteredAccommodations = this.accommodations;
  }

  loadAvailableCities(): void {
    // Récupérer les villes depuis les événements
    const events = this.eventsService.getAllEvents();
    const eventCities = [...new Set(events.map(e => e.location))];
    
    // Récupérer les villes avec des hébergements
    const accommodationCities = this.accommodationService.getAvailableCities();
    
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
    let filtered = this.accommodations;

    // Filtre par ville
    if (this.selectedCity !== 'Toutes') {
      filtered = filtered.filter(acc => acc.city === this.selectedCity);
    }

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(acc =>
        acc.name.toLowerCase().includes(query) ||
        acc.address.toLowerCase().includes(query) ||
        acc.city.toLowerCase().includes(query)
      );
    }

    this.filteredAccommodations = filtered;
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  addAccommodation(): void {
    if (this.validateForm()) {
      const accommodation = this.accommodationService.addAccommodation({
        ...this.newAccommodation,
        totalSpots: Number(this.newAccommodation.totalSpots),
        availableSpots: Number(this.newAccommodation.availableSpots)
      });
      
      this.loadAccommodations();
      this.applyFilters();
      this.resetForm();
      this.showAddForm = false;
      
      alert(`✅ Hébergement "${accommodation.name}" ajouté avec succès !`);
    }
  }

  validateForm(): boolean {
    if (!this.newAccommodation.name.trim()) {
      alert('❌ Le nom est requis');
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
    if (this.newAccommodation.totalSpots < 1) {
      alert('❌ Le nombre total de places doit être supérieur à 0');
      return false;
    }
    if (this.newAccommodation.availableSpots < 0) {
      alert('❌ Le nombre de places disponibles ne peut pas être négatif');
      return false;
    }
    if (this.newAccommodation.availableSpots > this.newAccommodation.totalSpots) {
      alert('❌ Le nombre de places disponibles ne peut pas dépasser le total');
      return false;
    }
    return true;
  }

  resetForm(): void {
    this.newAccommodation = {
      name: '',
      address: '',
      city: '',
      availableSpots: 1,
      totalSpots: 1,
      description: '',
      contactEmail: ''
    };
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  contactAccommodation(accommodation: Accommodation): void {
    if (accommodation.contactEmail) {
      window.location.href = `mailto:${accommodation.contactEmail}?subject=Demande d'hébergement - ${accommodation.name}`;
    } else {
      alert('📧 Aucun email de contact disponible pour cet hébergement');
    }
  }

  getAvailabilityClass(accommodation: Accommodation): string {
    const ratio = accommodation.availableSpots / accommodation.totalSpots;
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
