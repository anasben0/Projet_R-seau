package com.anasvalisoa.backend.dto.accommodation;

import java.time.ZonedDateTime;
import java.util.UUID;

public class AccommodationResponse {

    private UUID id;
    private UUID eventId;
    private String eventName;
    private String schoolName;  // Nom de l'école associée à l'événement
    private UUID hostId;
    private String hostName;
    private String title;
    private String address;
    private String contact;
    private Integer capacity;
    private Integer availableSpots;
    private Integer acceptedGuests;
    private ZonedDateTime createdAt;

    // Constructors
    public AccommodationResponse() {
    }

    public AccommodationResponse(UUID id, UUID eventId, String eventName, String schoolName, UUID hostId, String hostName,
                                 String title, String address, String contact, Integer capacity,
                                 Integer availableSpots, Integer acceptedGuests, ZonedDateTime createdAt) {
        this.id = id;
        this.eventId = eventId;
        this.eventName = eventName;
        this.schoolName = schoolName;
        this.hostId = hostId;
        this.hostName = hostName;
        this.title = title;
        this.address = address;
        this.contact = contact;
        this.capacity = capacity;
        this.availableSpots = availableSpots;
        this.acceptedGuests = acceptedGuests;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public UUID getHostId() {
        return hostId;
    }

    public void setHostId(UUID hostId) {
        this.hostId = hostId;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getAvailableSpots() {
        return availableSpots;
    }

    public void setAvailableSpots(Integer availableSpots) {
        this.availableSpots = availableSpots;
    }

    public Integer getAcceptedGuests() {
        return acceptedGuests;
    }

    public void setAcceptedGuests(Integer acceptedGuests) {
        this.acceptedGuests = acceptedGuests;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
