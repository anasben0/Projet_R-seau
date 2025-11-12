package com.anasvalisoa.backend.dto.accommodation;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateAccommodationRequest {

    // eventId est désormais optionnel - l'événement général sera utilisé par défaut
    private UUID eventId;

    private String title;

    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    private String contact;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    // Constructors
    public CreateAccommodationRequest() {
    }

    public CreateAccommodationRequest(UUID eventId, String title, String description, String address, String contact, Integer capacity) {
        this.eventId = eventId;
        this.title = title;
        this.description = description;
        this.address = address;
        this.contact = contact;
        this.capacity = capacity;
    }

    // Getters and Setters
    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
}
