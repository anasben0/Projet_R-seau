package com.anasvalisoa.backend.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "accommodation_guests")
public class AccommodationGuest {

    @EmbeddedId
    private AccommodationGuestId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("accommodationId")
    @JoinColumn(name = "accommodation_id", nullable = false)
    private Accommodation accommodation;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("guestId")
    @JoinColumn(name = "guest_id", nullable = false)
    private User guest;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RequestStatus status;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private ZonedDateTime requestedAt;

    @PrePersist
    protected void onCreate() {
        if (requestedAt == null) {
            requestedAt = ZonedDateTime.now();
        }
    }

    // Constructors
    public AccommodationGuest() {
    }

    public AccommodationGuest(Accommodation accommodation, User guest, RequestStatus status) {
        this.id = new AccommodationGuestId(accommodation.getId(), guest.getId());
        this.accommodation = accommodation;
        this.guest = guest;
        this.status = status;
    }

    // Getters and Setters
    public AccommodationGuestId getId() {
        return id;
    }

    public void setId(AccommodationGuestId id) {
        this.id = id;
    }

    public Accommodation getAccommodation() {
        return accommodation;
    }

    public void setAccommodation(Accommodation accommodation) {
        this.accommodation = accommodation;
    }

    public User getGuest() {
        return guest;
    }

    public void setGuest(User guest) {
        this.guest = guest;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public ZonedDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(ZonedDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    // Embedded ID class
    @Embeddable
    public static class AccommodationGuestId implements Serializable {
        @Column(name = "accommodation_id")
        private UUID accommodationId;

        @Column(name = "guest_id")
        private UUID guestId;

        public AccommodationGuestId() {
        }

        public AccommodationGuestId(UUID accommodationId, UUID guestId) {
            this.accommodationId = accommodationId;
            this.guestId = guestId;
        }

        public UUID getAccommodationId() {
            return accommodationId;
        }

        public void setAccommodationId(UUID accommodationId) {
            this.accommodationId = accommodationId;
        }

        public UUID getGuestId() {
            return guestId;
        }

        public void setGuestId(UUID guestId) {
            this.guestId = guestId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AccommodationGuestId that = (AccommodationGuestId) o;
            return Objects.equals(accommodationId, that.accommodationId) &&
                   Objects.equals(guestId, that.guestId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(accommodationId, guestId);
        }
    }
}
