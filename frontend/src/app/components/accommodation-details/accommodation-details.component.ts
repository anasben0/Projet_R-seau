import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccommodationService, Accommodation } from '../../services/accommodation.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

export interface Guest {
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guestSchool?: string;
  status: 'requested' | 'accepted' | 'declined';
  requestedAt: string;
}

@Component({
  selector: 'app-accommodation-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accommodation-details.component.html',
  styleUrls: ['./accommodation-details.component.css']
})
export class AccommodationDetailsComponent implements OnInit {
  accommodationId: string = '';
  accommodation: Accommodation | null = null;
  guests: Guest[] = [];
  currentUser: any = null;
  isHost: boolean = false;
  isAdmin: boolean = false;
  
  // Statut de la demande de l'utilisateur actuel
  currentUserRequest: Guest | null = null;
  
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accommodationService: AccommodationService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('=== AccommodationDetailsComponent ngOnInit ===');
    console.log('Platform is browser:', isPlatformBrowser(this.platformId));
    
    // Ne charger que côté client (navigateur)
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Running on server, skipping data load');
      return;
    }
    
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user:', this.currentUser);
    this.checkAdminStatus();
    
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      this.accommodationId = params['id'];
      console.log('Accommodation ID from route:', this.accommodationId);
      if (this.accommodationId) {
        console.log('Starting to load accommodation details...');
        this.loadAccommodationDetails();
      } else {
        console.error('No accommodation ID in route!');
      }
    });
  }

  checkAdminStatus(): void {
    this.isAdmin = this.currentUser?.role === 'admin' || this.currentUser?.email === 'dev@polyrezo.com';
  }

  async loadAccommodationDetails(): Promise<void> {
    this.loading = true;
    this.error = '';
    
    console.log('Loading accommodation details for ID:', this.accommodationId);

    try {
      // Charger les détails de l'hébergement
      console.log('Fetching accommodation...');
      const accommodation = await firstValueFrom(
        this.accommodationService.getAccommodationById(this.accommodationId)
      );
      
      console.log('Accommodation loaded:', accommodation);
      this.accommodation = accommodation;
      this.isHost = this.currentUser?.id === accommodation.hostId;
      console.log('Is host:', this.isHost, 'Current user ID:', this.currentUser?.id, 'Host ID:', accommodation.hostId);
      
      await this.loadGuests();
    } catch (error: any) {
      console.error('Error loading accommodation:', error);
      this.error = `Erreur lors du chargement de l'hébergement: ${error.message || error.status}`;
      this.loading = false;
    }
  }

  async loadGuests(): Promise<void> {
    console.log('Loading guests for accommodation:', this.accommodationId);
    try {
      const guests = await firstValueFrom(
        this.accommodationService.getGuestsByAccommodation(this.accommodationId)
      );
      
      console.log('Guests loaded:', guests);
      this.guests = guests;
      
      // Trouver la demande de l'utilisateur actuel
      if (this.currentUser) {
        this.currentUserRequest = guests.find(g => g.guestId === this.currentUser.id) || null;
        console.log('Current user request:', this.currentUserRequest);
      }
      
      this.loading = false;
      this.cdr.detectChanges(); // ← Forcer la détection de changements
      console.log('Loading complete');
    } catch (error: any) {
      console.error('Error loading guests:', error);
      console.error('Error details:', error.error);
      this.error = `Erreur lors du chargement des invités: ${error.message || error.status}`;
      this.loading = false;
      this.cdr.detectChanges(); // ← Forcer la détection de changements
    }
  }

  getAcceptedGuests(): Guest[] {
    return this.guests.filter(g => g.status === 'accepted');
  }

  getPendingGuests(): Guest[] {
    return this.guests.filter(g => g.status === 'requested');
  }

  getDeclinedGuests(): Guest[] {
    return this.guests.filter(g => g.status === 'declined');
  }

  // Calcule les places disponibles en temps réel
  getAvailableSpots(): number {
    if (!this.accommodation) return 0;
    const acceptedCount = this.getAcceptedGuests().length;
    return this.accommodation.capacity - acceptedCount;
  }

  canSeeFullDetails(guest: Guest): boolean {
    // L'hôte et les admins peuvent voir tous les détails
    return this.isHost || this.isAdmin;
  }

  requestToJoin(): void {
    if (!this.currentUser) {
      alert('❌ Vous devez être connecté pour rejoindre un hébergement');
      this.router.navigate(['/login']);
      return;
    }

    if (this.isHost) {
      alert('ℹ️ Vous êtes le propriétaire de cet hébergement');
      return;
    }

    if (this.currentUserRequest) {
      alert('ℹ️ Vous avez déjà fait une demande pour cet hébergement');
      return;
    }

    if (this.getAvailableSpots() === 0) {
      alert('❌ Cet hébergement est complet');
      return;
    }

    this.accommodationService.joinAccommodation(this.accommodationId, this.currentUser.id).subscribe({
      next: () => {
        alert('✅ Votre demande a été envoyée avec succès !');
        this.loadAccommodationDetails(); // Recharge les détails ET les invités
      },
      error: (error) => {
        console.error('Error joining accommodation:', error);
        alert(`❌ Erreur: ${error.error?.error || error.message}`);
      }
    });
  }

  cancelRequest(): void {
    if (!this.currentUserRequest) return;

    if (confirm('Êtes-vous sûr de vouloir annuler votre demande ?')) {
      this.accommodationService.leaveAccommodation(this.accommodationId, this.currentUser.id).subscribe({
        next: () => {
          alert('✅ Votre demande a été annulée');
          this.loadAccommodationDetails(); // Recharge les détails ET les invités
        },
        error: (error) => {
          console.error('Error canceling request:', error);
          alert(`❌ Erreur: ${error.error?.error || error.message}`);
        }
      });
    }
  }

  acceptGuest(guest: Guest): void {
    // Seul l'hôte peut accepter les demandes
    if (!this.isHost) {
      alert('❌ Seul le propriétaire de l\'hébergement peut accepter les demandes');
      return;
    }

    this.accommodationService.updateGuestStatus(
      this.accommodationId,
      guest.guestId,
      'accepted'
    ).subscribe({
      next: () => {
        alert(`✅ Demande de ${guest.guestName} acceptée`);
        this.loadAccommodationDetails();
      },
      error: (error) => {
        console.error('Error accepting guest:', error);
        alert(`❌ Erreur: ${error.error?.error || error.message}`);
      }
    });
  }

  declineGuest(guest: Guest): void {
    // Seul l'hôte peut refuser les demandes
    if (!this.isHost) {
      alert('❌ Seul le propriétaire de l\'hébergement peut refuser les demandes');
      return;
    }

    if (confirm(`Refuser la demande de ${guest.guestName} ?`)) {
      this.accommodationService.updateGuestStatus(
        this.accommodationId,
        guest.guestId,
        'declined'
      ).subscribe({
        next: () => {
          alert(`❌ Demande de ${guest.guestName} refusée`);
          this.loadGuests();
        },
        error: (error) => {
          console.error('Error declining guest:', error);
          alert(`❌ Erreur: ${error.error?.error || error.message}`);
        }
      });
    }
  }

  removeGuest(guest: Guest): void {
    // Seul l'hôte peut retirer des invités
    if (!this.isHost) {
      alert('❌ Seul le propriétaire de l\'hébergement peut retirer des invités');
      return;
    }

    if (confirm(`Retirer ${guest.guestName} de l'hébergement ?`)) {
      this.accommodationService.leaveAccommodation(this.accommodationId, guest.guestId).subscribe({
        next: () => {
          alert(`✅ ${guest.guestName} a été retiré de l'hébergement`);
          this.loadAccommodationDetails();
        },
        error: (error) => {
          console.error('Error removing guest:', error);
          alert(`❌ Erreur: ${error.error?.error || error.message}`);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'accepted':
        return 'status-accepted';
      case 'requested':
        return 'status-pending';
      case 'declined':
        return 'status-declined';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'accepted':
        return '✅ Accepté';
      case 'requested':
        return '⏳ En attente';
      case 'declined':
        return '❌ Refusé';
      default:
        return status;
    }
  }

  goBack(): void {
    this.router.navigate(['/accommodations']);
  }

  contactHost(): void {
    if (this.accommodation && this.accommodation.contact) {
      if (this.accommodation.contact.includes('@')) {
        window.location.href = `mailto:${this.accommodation.contact}?subject=Demande d'hébergement - ${this.accommodation.title}`;
      } else {
        alert(`📞 Contact: ${this.accommodation.contact}`);
      }
    } else {
      alert('📧 Aucun contact disponible');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
