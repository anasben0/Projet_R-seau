package com.anasvalisoa.backend.controller;

import com.anasvalisoa.backend.dto.event.CreateEventRequest;
import com.anasvalisoa.backend.dto.event.EventResponse;
import com.anasvalisoa.backend.dto.event.UpdateEventRequest;
import com.anasvalisoa.backend.service.EventService;
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
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * Create a new event
     * POST /api/events?userId=<uuid>
     */
    @PostMapping
    public ResponseEntity<?> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @RequestParam UUID userId) {
        try {
            EventResponse event = eventService.createEvent(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(event);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Validation failed",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Server error",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Get all events (ordered by start date)
     * GET /api/events
     */
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    /**
     * Get upcoming events only
     * GET /api/events/upcoming
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents() {
        List<EventResponse> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }

    /**
     * Get a specific event by ID
     * GET /api/events/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable UUID id) {
        try {
            EventResponse event = eventService.getEventById(id);
            return ResponseEntity.ok(event);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Not found",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Get events by school
     * GET /api/events/school/{schoolId}
     */
    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<EventResponse>> getEventsBySchool(@PathVariable UUID schoolId) {
        List<EventResponse> events = eventService.getEventsBySchool(schoolId);
        return ResponseEntity.ok(events);
    }

    /**
     * Get upcoming events by school
     * GET /api/events/school/{schoolId}/upcoming
     */
    @GetMapping("/school/{schoolId}/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEventsBySchool(@PathVariable UUID schoolId) {
        List<EventResponse> events = eventService.getUpcomingEventsBySchool(schoolId);
        return ResponseEntity.ok(events);
    }

    /**
     * Get events created by a user
     * GET /api/events/creator/{creatorId}
     */
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<EventResponse>> getEventsByCreator(@PathVariable UUID creatorId) {
        List<EventResponse> events = eventService.getEventsByCreator(creatorId);
        return ResponseEntity.ok(events);
    }

    /**
     * Update an event
     * PUT /api/events/{id}?userId=<uuid>
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEventRequest request,
            @RequestParam UUID userId) {
        try {
            EventResponse event = eventService.updateEvent(id, request, userId);
            return ResponseEntity.ok(event);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Not found",
                "message", e.getMessage()
            ));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "Forbidden",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Server error",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Delete an event
     * DELETE /api/events/{id}?userId=<uuid>
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable UUID id,
            @RequestParam UUID userId) {
        try {
            eventService.deleteEvent(id, userId);
            return ResponseEntity.ok(Map.of(
                "message", "Event deleted successfully"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Not found",
                "message", e.getMessage()
            ));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "Forbidden",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Server error",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Validation failed");
        response.put("fields", errors);

        return ResponseEntity.badRequest().body(response);
    }
}
