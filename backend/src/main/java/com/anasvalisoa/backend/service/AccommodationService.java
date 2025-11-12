package com.anasvalisoa.backend.service;

import com.anasvalisoa.backend.dto.accommodation.AccommodationResponse;
import com.anasvalisoa.backend.dto.accommodation.CreateAccommodationRequest;
import com.anasvalisoa.backend.dto.accommodation.GuestResponse;
import com.anasvalisoa.backend.dto.accommodation.UpdateAccommodationRequest;
import com.anasvalisoa.backend.entity.*;
import com.anasvalisoa.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final AccommodationGuestRepository accommodationGuestRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;

    public AccommodationService(AccommodationRepository accommodationRepository,
                                AccommodationGuestRepository accommodationGuestRepository,
                                EventRepository eventRepository,
                                UserRepository userRepository,
                                SchoolRepository schoolRepository) {
        this.accommodationRepository = accommodationRepository;
        this.accommodationGuestRepository = accommodationGuestRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.schoolRepository = schoolRepository;
    }

    @Transactional
    public AccommodationResponse createAccommodation(CreateAccommodationRequest request, UUID hostId) {
        // Vérifier que l'utilisateur existe et récupérer son école
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UUID schoolId = host.getSchoolId();
        
        // Chercher ou créer l'événement général pour cette école
        Event event;
        if (request.getEventId() != null) {
            // Si un eventId est spécifié, l'utiliser
            event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new RuntimeException("Event not found"));
        } else {
            // Sinon, chercher l'événement général de cette école
            // (nom fixe pour identifier l'événement général)
            event = eventRepository.findAll().stream()
                    .filter(e -> "Hébergements Polytech - Réseau".equals(e.getName()) 
                              && schoolId.equals(e.getSchoolId()))
                    .findFirst()
                    .orElseGet(() -> {
                        // Créer l'événement général pour cette école
                        Event generalEvent = new Event();
                        generalEvent.setSchoolId(schoolId);
                        generalEvent.setName("Hébergements Polytech - Réseau");
                        generalEvent.setActivities("Hébergements proposés par les membres du réseau Polytech");
                        generalEvent.setStartsAt(java.time.OffsetDateTime.parse("2024-01-01T00:00:00Z"));
                        generalEvent.setEndsAt(java.time.OffsetDateTime.parse("2099-12-31T23:59:59Z"));
                        generalEvent.setAddress("France");
                        generalEvent.setRoom("Réseau Polytech");
                        generalEvent.setCreatedBy(hostId);
                        generalEvent.setCreatedAt(java.time.OffsetDateTime.now());
                        
                        return eventRepository.save(generalEvent);
                    });
        }

        // Créer l'hébergement
        Accommodation accommodation = new Accommodation(
                event,
                host,
                request.getTitle(),
                request.getAddress(),
                request.getContact(),
                request.getCapacity()
        );

        Accommodation saved = accommodationRepository.save(accommodation);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AccommodationResponse> getAllAccommodations() {
        return accommodationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AccommodationResponse> getAccommodationsByEvent(UUID eventId) {
        return accommodationRepository.findByEventId(eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AccommodationResponse> getAvailableAccommodationsByEvent(UUID eventId) {
        return accommodationRepository.findByEventId(eventId).stream()
                .map(this::mapToResponse)
                .filter(acc -> acc.getAvailableSpots() > 0)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AccommodationResponse> getAccommodationsByHost(UUID hostId) {
        return accommodationRepository.findByHostId(hostId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AccommodationResponse getAccommodationById(UUID id) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accommodation not found"));
        return mapToResponse(accommodation);
    }

    @Transactional
    public AccommodationResponse updateAccommodation(UUID id, UpdateAccommodationRequest request, UUID userId) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accommodation not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier que l'utilisateur est le créateur
        if (!accommodation.getHost().getId().equals(userId)) {
            throw new RuntimeException("Only the host can update this accommodation");
        }

        // Mettre à jour les champs si fournis
        if (request.getTitle() != null) {
            accommodation.setTitle(request.getTitle());
        }
        if (request.getAddress() != null) {
            accommodation.setAddress(request.getAddress());
        }
        if (request.getContact() != null) {
            accommodation.setContact(request.getContact());
        }
        if (request.getCapacity() != null) {
            // Vérifier qu'on ne réduit pas la capacité en dessous du nombre d'invités acceptés
            Long acceptedCount = accommodationGuestRepository.countByAccommodationIdAndStatus(id, RequestStatus.accepted);
            if (request.getCapacity() < acceptedCount) {
                throw new RuntimeException("Cannot reduce capacity below the number of accepted guests (" + acceptedCount + ")");
            }
            accommodation.setCapacity(request.getCapacity());
        }

        Accommodation updated = accommodationRepository.save(accommodation);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteAccommodation(UUID id, UUID userId) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accommodation not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier que l'utilisateur est le créateur
        if (!accommodation.getHost().getId().equals(userId)) {
            throw new RuntimeException("Only the host can delete this accommodation");
        }

        accommodationRepository.delete(accommodation);
    }

    @Transactional
    public void joinAccommodation(UUID accommodationId, UUID guestId) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new RuntimeException("Accommodation not found"));

        User guest = userRepository.findById(guestId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vérifier si l'utilisateur a déjà une demande
        if (accommodationGuestRepository.findByAccommodationIdAndGuestId(accommodationId, guestId).isPresent()) {
            throw new RuntimeException("You already have a request for this accommodation");
        }

        // Vérifier si l'utilisateur est le host
        if (accommodation.getHost().getId().equals(guestId)) {
            throw new RuntimeException("You cannot join your own accommodation");
        }

        // Vérifier la capacité disponible (compter seulement les acceptés)
        Long acceptedCount = accommodationGuestRepository.countByAccommodationIdAndStatus(accommodationId, RequestStatus.accepted);
        if (acceptedCount >= accommodation.getCapacity()) {
            throw new RuntimeException("This accommodation is full");
        }

        // Créer la demande avec statut "requested" - l'hôte devra accepter
        AccommodationGuest accommodationGuest = new AccommodationGuest(accommodation, guest, RequestStatus.requested);
        accommodationGuestRepository.save(accommodationGuest);
    }

    @Transactional
    public void leaveAccommodation(UUID accommodationId, UUID guestId) {
        AccommodationGuest.AccommodationGuestId id = new AccommodationGuest.AccommodationGuestId(accommodationId, guestId);
        AccommodationGuest accommodationGuest = accommodationGuestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest not found in this accommodation"));

        accommodationGuestRepository.delete(accommodationGuest);
    }

    @Transactional(readOnly = true)
    public List<GuestResponse> getGuestsByAccommodation(UUID accommodationId) {
        return accommodationGuestRepository.findByAccommodationId(accommodationId).stream()
                .map(this::mapToGuestResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AccommodationResponse> getMyAccommodations(UUID guestId) {
        return accommodationGuestRepository.findByGuestId(guestId).stream()
                .map(ag -> mapToResponse(ag.getAccommodation()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateGuestStatus(UUID accommodationId, UUID guestId, RequestStatus newStatus) {
        AccommodationGuest.AccommodationGuestId id = new AccommodationGuest.AccommodationGuestId(accommodationId, guestId);
        AccommodationGuest accommodationGuest = accommodationGuestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest not found in this accommodation"));

        // Vérifier la capacité si on accepte un invité
        if (newStatus == RequestStatus.accepted && accommodationGuest.getStatus() != RequestStatus.accepted) {
            Accommodation accommodation = accommodationRepository.findById(accommodationId)
                    .orElseThrow(() -> new RuntimeException("Accommodation not found"));
            
            Long acceptedCount = accommodationGuestRepository.countByAccommodationIdAndStatus(accommodationId, RequestStatus.accepted);
            if (acceptedCount >= accommodation.getCapacity()) {
                throw new RuntimeException("This accommodation is full");
            }
        }

        accommodationGuest.setStatus(newStatus);
        accommodationGuestRepository.save(accommodationGuest);
    }

    private AccommodationResponse mapToResponse(Accommodation accommodation) {
        Long acceptedCount = accommodationGuestRepository.countByAccommodationIdAndStatus(
                accommodation.getId(),
                RequestStatus.accepted
        );

        String hostName = accommodation.getHost().getFirstName() + " " + accommodation.getHost().getLastName();
        String eventName = accommodation.getEvent().getName();
        String schoolName = accommodation.getEvent().getSchool().getName();  // Nom de l'école

        return new AccommodationResponse(
                accommodation.getId(),
                accommodation.getEvent().getId(),
                eventName,
                schoolName,
                accommodation.getHost().getId(),
                hostName,
                accommodation.getTitle(),
                accommodation.getAddress(),
                accommodation.getContact(),
                accommodation.getCapacity(),
                accommodation.getCapacity() - acceptedCount.intValue(),
                acceptedCount.intValue(),
                accommodation.getCreatedAt()
        );
    }

    private GuestResponse mapToGuestResponse(AccommodationGuest ag) {
        User guest = ag.getGuest();
        String guestName = guest.getFirstName() + " " + guest.getLastName();
        String guestPhone = guest.getPhone();
        
        // Récupérer le nom de l'école
        String schoolName = schoolRepository.findById(guest.getSchoolId())
                .map(School::getName)
                .orElse("École inconnue");
        
        return new GuestResponse(
                guest.getId(),
                guestName,
                guest.getEmail(),
                guestPhone,
                schoolName,
                ag.getStatus().name(),
                ag.getRequestedAt()
        );
    }
}
