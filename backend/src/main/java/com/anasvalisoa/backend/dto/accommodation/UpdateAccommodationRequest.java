package com.anasvalisoa.backend.dto.accommodation;

import jakarta.validation.constraints.Min;

public class UpdateAccommodationRequest {

    private String title;
    private String description;
    private String address;
    private String contact;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    // Constructors
    public UpdateAccommodationRequest() {
    }

    public UpdateAccommodationRequest(String title, String description, String address, String contact, Integer capacity) {
        this.title = title;
        this.description = description;
        this.address = address;
        this.contact = contact;
        this.capacity = capacity;
    }

    // Getters and Setters
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
