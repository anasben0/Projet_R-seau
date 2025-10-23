package com.anasvalisoa.backend.dto.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.UUID;

public class CreateEventRequest {
    @NotNull(message = "School ID is required")
    private UUID schoolId;

    @NotBlank(message = "Event name is required")
    private String name;

    private String activities;

    @NotNull(message = "Start date and time is required")
    private OffsetDateTime startsAt;

    private OffsetDateTime endsAt;

    private String address;

    private String room;

    // Getters and Setters
    public UUID getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(UUID schoolId) {
        this.schoolId = schoolId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getActivities() {
        return activities;
    }

    public void setActivities(String activities) {
        this.activities = activities;
    }

    public OffsetDateTime getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(OffsetDateTime startsAt) {
        this.startsAt = startsAt;
    }

    public OffsetDateTime getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(OffsetDateTime endsAt) {
        this.endsAt = endsAt;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }
}
