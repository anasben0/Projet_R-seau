package com.anasvalisoa.backend.controller;

import com.anasvalisoa.backend.dto.accommodation.AccommodationResponse;
import com.anasvalisoa.backend.dto.accommodation.CreateAccommodationRequest;
import com.anasvalisoa.backend.dto.accommodation.GuestResponse;
import com.anasvalisoa.backend.dto.accommodation.UpdateAccommodationRequest;
import com.anasvalisoa.backend.entity.RequestStatus;
import com.anasvalisoa.backend.service.AccommodationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/accommodations")
public class AccommodationController {

    private final AccommodationService accommodationService;

    public AccommodationController(AccommodationService accommodationService) {
        this.accommodationService = accommodationService;
    }

    /**
     * Créer un hébergement
     * POST /api/accommodations?hostId={uuid}
     */
    @PostMapping
    public ResponseEntity<?> createAccommodation(
            @Valid @RequestBody CreateAccommodationRequest request,
            @RequestParam UUID hostId) {
        try {
            System.out.println("Creating accommodation with request: " + request);
            System.out.println("Host ID: " + hostId);
            System.out.println("Title: " + request.getTitle());
            System.out.println("Address: " + request.getAddress());
            System.out.println("Contact: " + request.getContact());
            System.out.println("Capacity: " + request.getCapacity());
            System.out.println("EventId: " + request.getEventId());
            
            AccommodationResponse response = accommodationService.createAccommodation(request, hostId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Récupérer tous les hébergements
     * GET /api/accommodations
     */
    @GetMapping
    public ResponseEntity<List<AccommodationResponse>> getAllAccommodations() {
        List<AccommodationResponse> accommodations = accommodationService.getAllAccommodations();
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Récupérer les hébergements d'un événement
     * GET /api/accommodations/event/{eventId}
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<AccommodationResponse>> getAccommodationsByEvent(@PathVariable UUID eventId) {
        List<AccommodationResponse> accommodations = accommodationService.getAccommodationsByEvent(eventId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Récupérer les hébergements disponibles d'un événement (avec places libres)
     * GET /api/accommodations/event/{eventId}/available
     */
    @GetMapping("/event/{eventId}/available")
    public ResponseEntity<List<AccommodationResponse>> getAvailableAccommodationsByEvent(@PathVariable UUID eventId) {
        List<AccommodationResponse> accommodations = accommodationService.getAvailableAccommodationsByEvent(eventId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Récupérer les hébergements créés par un host
     * GET /api/accommodations/host/{hostId}
     */
    @GetMapping("/host/{hostId}")
    public ResponseEntity<List<AccommodationResponse>> getAccommodationsByHost(@PathVariable UUID hostId) {
        List<AccommodationResponse> accommodations = accommodationService.getAccommodationsByHost(hostId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Récupérer un hébergement par son ID
     * GET /api/accommodations/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AccommodationResponse> getAccommodationById(@PathVariable UUID id) {
        try {
            System.out.println("GET /api/accommodations/" + id);
            AccommodationResponse accommodation = accommodationService.getAccommodationById(id);
            System.out.println("Accommodation found: " + accommodation.getTitle());
            return ResponseEntity.ok(accommodation);
        } catch (RuntimeException e) {
            System.err.println("Error getting accommodation by ID: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Modifier un hébergement (uniquement par le créateur)
     * PUT /api/accommodations/{id}?hostId={uuid}
     */
    @PutMapping("/{id}")
    public ResponseEntity<AccommodationResponse> updateAccommodation(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAccommodationRequest request,
            @RequestParam UUID hostId) {
        try {
            AccommodationResponse response = accommodationService.updateAccommodation(id, request, hostId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Only the host")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Supprimer un hébergement (uniquement par le créateur)
     * DELETE /api/accommodations/{id}?hostId={uuid}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccommodation(
            @PathVariable UUID id,
            @RequestParam UUID hostId) {
        try {
            accommodationService.deleteAccommodation(id, hostId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Only the host")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Rejoindre un hébergement (se rajouter comme invité)
     * POST /api/accommodations/{id}/join?guestId={uuid}
     */
    @PostMapping("/{id}/join")
    public ResponseEntity<Map<String, String>> joinAccommodation(
            @PathVariable UUID id,
            @RequestParam UUID guestId) {
        try {
            accommodationService.joinAccommodation(id, guestId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Successfully joined the accommodation");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            if (e.getMessage().contains("full")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Quitter un hébergement
     * DELETE /api/accommodations/{id}/leave?guestId={uuid}
     */
    @DeleteMapping("/{id}/leave")
    public ResponseEntity<Map<String, String>> leaveAccommodation(
            @PathVariable UUID id,
            @RequestParam UUID guestId) {
        try {
            accommodationService.leaveAccommodation(id, guestId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Successfully left the accommodation");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Récupérer la liste des invités d'un hébergement
     * GET /api/accommodations/{id}/guests
     */
    @GetMapping("/{id}/guests")
    public ResponseEntity<List<GuestResponse>> getGuestsByAccommodation(@PathVariable UUID id) {
        System.out.println("GET /api/accommodations/" + id + "/guests");
        List<GuestResponse> guests = accommodationService.getGuestsByAccommodation(id);
        System.out.println("Found " + guests.size() + " guests");
        return ResponseEntity.ok(guests);
    }

    /**
     * Récupérer les hébergements où je suis invité
     * GET /api/accommodations/my-accommodations?guestId={uuid}
     */
    @GetMapping("/my-accommodations")
    public ResponseEntity<List<AccommodationResponse>> getMyAccommodations(@RequestParam UUID guestId) {
        List<AccommodationResponse> accommodations = accommodationService.getMyAccommodations(guestId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Mettre à jour le statut d'un invité (accepter/refuser)
     * PUT /api/accommodations/{id}/guests/{guestId}/status
     */
    @PutMapping("/{id}/guests/{guestId}/status")
    public ResponseEntity<Map<String, String>> updateGuestStatus(
            @PathVariable UUID id,
            @PathVariable UUID guestId,
            @RequestBody Map<String, String> body) {
        try {
            String statusStr = body.get("status");
            if (statusStr == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }

            RequestStatus status;
            try {
                status = RequestStatus.valueOf(statusStr.toLowerCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid status value"));
            }

            accommodationService.updateGuestStatus(id, guestId, status);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Guest status updated successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            if (e.getMessage().contains("full")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Gestion des erreurs de validation
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
}
