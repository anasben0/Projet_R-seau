package com.anasvalisoa.backend.dto.accommodation;

import java.time.ZonedDateTime;
import java.util.UUID;

public class GuestResponse {

    private UUID guestId;
    private String guestName;
    private String guestEmail;
    private String status;
    private ZonedDateTime requestedAt;

    // Constructors
    public GuestResponse() {
    }

    public GuestResponse(UUID guestId, String guestName, String guestEmail, String status, ZonedDateTime requestedAt) {
        this.guestId = guestId;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.status = status;
        this.requestedAt = requestedAt;
    }

    // Getters and Setters
    public UUID getGuestId() {
        return guestId;
    }

    public void setGuestId(UUID guestId) {
        this.guestId = guestId;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getGuestEmail() {
        return guestEmail;
    }

    public void setGuestEmail(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(ZonedDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }
}
