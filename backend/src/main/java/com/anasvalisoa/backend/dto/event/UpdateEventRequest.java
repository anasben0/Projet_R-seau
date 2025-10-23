package com.anasvalisoa.backend.dto.event;

import java.time.OffsetDateTime;

public class UpdateEventRequest {
    private String name;
    private String activities;
    private OffsetDateTime startsAt;
    private OffsetDateTime endsAt;
    private String address;
    private String room;

    // Getters and Setters
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
