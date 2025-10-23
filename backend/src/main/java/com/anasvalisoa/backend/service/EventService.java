package com.anasvalisoa.backend.service;

import com.anasvalisoa.backend.dto.event.CreateEventRequest;
import com.anasvalisoa.backend.dto.event.EventResponse;
import com.anasvalisoa.backend.dto.event.UpdateEventRequest;
import com.anasvalisoa.backend.entity.Event;
import com.anasvalisoa.backend.entity.School;
import com.anasvalisoa.backend.entity.User;
import com.anasvalisoa.backend.repository.EventRepository;
import com.anasvalisoa.backend.repository.SchoolRepository;
import com.anasvalisoa.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, 
                       SchoolRepository schoolRepository,
                       UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EventResponse createEvent(CreateEventRequest request, UUID createdBy) {
        // Validate school exists
        School school = schoolRepository.findById(request.getSchoolId())
            .orElseThrow(() -> new IllegalArgumentException("School not found with id: " + request.getSchoolId()));

        // Validate user exists
        User creator = userRepository.findById(createdBy)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + createdBy));

        // Validate dates
        if (request.getEndsAt() != null && request.getEndsAt().isBefore(request.getStartsAt())) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        Event event = new Event();
        event.setSchoolId(request.getSchoolId());
        event.setName(request.getName());
        event.setActivities(request.getActivities());
        event.setStartsAt(request.getStartsAt());
        event.setEndsAt(request.getEndsAt());
        event.setAddress(request.getAddress());
        event.setRoom(request.getRoom());
        event.setCreatedBy(createdBy);
        event.setCreatedAt(OffsetDateTime.now());

        Event savedEvent = eventRepository.save(event);
        return mapToResponse(savedEvent, school, creator);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAllByOrderByStartsAtAsc().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(OffsetDateTime.now()).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsBySchool(UUID schoolId) {
        return eventRepository.findBySchoolIdOrderByStartsAtAsc(schoolId).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getUpcomingEventsBySchool(UUID schoolId) {
        return eventRepository.findUpcomingEventsBySchool(schoolId, OffsetDateTime.now()).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByCreator(UUID creatorId) {
        return eventRepository.findByCreatedByOrderByCreatedAtDesc(creatorId).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(UUID eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + eventId));
        return mapToResponse(event);
    }

    @Transactional
    public EventResponse updateEvent(UUID eventId, UpdateEventRequest request, UUID userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + eventId));

        // Check if user is the creator or admin
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!event.getCreatedBy().equals(userId) && user.getRole() != com.anasvalisoa.backend.entity.Role.admin) {
            throw new SecurityException("You don't have permission to update this event");
        }

        // Update fields if provided
        if (request.getName() != null && !request.getName().isBlank()) {
            event.setName(request.getName());
        }
        if (request.getActivities() != null) {
            event.setActivities(request.getActivities());
        }
        if (request.getStartsAt() != null) {
            event.setStartsAt(request.getStartsAt());
        }
        if (request.getEndsAt() != null) {
            // Validate dates
            OffsetDateTime startsAt = request.getStartsAt() != null ? request.getStartsAt() : event.getStartsAt();
            if (request.getEndsAt().isBefore(startsAt)) {
                throw new IllegalArgumentException("End date must be after start date");
            }
            event.setEndsAt(request.getEndsAt());
        }
        if (request.getAddress() != null) {
            event.setAddress(request.getAddress());
        }
        if (request.getRoom() != null) {
            event.setRoom(request.getRoom());
        }

        Event updatedEvent = eventRepository.save(event);
        return mapToResponse(updatedEvent);
    }

    @Transactional
    public void deleteEvent(UUID eventId, UUID userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + eventId));

        // Check if user is the creator or admin
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!event.getCreatedBy().equals(userId) && user.getRole() != com.anasvalisoa.backend.entity.Role.admin) {
            throw new SecurityException("You don't have permission to delete this event");
        }

        eventRepository.delete(event);
    }

    private EventResponse mapToResponse(Event event) {
        School school = schoolRepository.findById(event.getSchoolId()).orElse(null);
        User creator = userRepository.findById(event.getCreatedBy()).orElse(null);
        return mapToResponse(event, school, creator);
    }

    private EventResponse mapToResponse(Event event, School school, User creator) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setSchoolId(event.getSchoolId());
        response.setSchoolName(school != null ? school.getName() : null);
        response.setName(event.getName());
        response.setActivities(event.getActivities());
        response.setStartsAt(event.getStartsAt());
        response.setEndsAt(event.getEndsAt());
        response.setAddress(event.getAddress());
        response.setRoom(event.getRoom());
        response.setCreatedBy(event.getCreatedBy());
        response.setCreatedByName(creator != null ? creator.getFirstName() + " " + creator.getLastName() : null);
        response.setCreatedAt(event.getCreatedAt());
        return response;
    }
}
