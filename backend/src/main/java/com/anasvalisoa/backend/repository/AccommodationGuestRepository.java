package com.anasvalisoa.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.anasvalisoa.backend.entity.AccommodationGuest;
import com.anasvalisoa.backend.entity.RequestStatus;

@Repository
public interface AccommodationGuestRepository extends JpaRepository<AccommodationGuest, AccommodationGuest.AccommodationGuestId> {

    // Trouver tous les invités d'un hébergement
    @Query("SELECT ag FROM AccommodationGuest ag WHERE ag.accommodation.id = :accommodationId ORDER BY ag.requestedAt DESC")
    List<AccommodationGuest> findByAccommodationId(@Param("accommodationId") UUID accommodationId);

    // Compter les invités acceptés pour un hébergement
    @Query("SELECT COUNT(ag) FROM AccommodationGuest ag WHERE ag.accommodation.id = :accommodationId AND ag.status = :status")
    Long countByAccommodationIdAndStatus(@Param("accommodationId") UUID accommodationId, @Param("status") RequestStatus status);

    // Vérifier si un utilisateur a déjà une demande pour un hébergement
    @Query("SELECT ag FROM AccommodationGuest ag WHERE ag.accommodation.id = :accommodationId AND ag.guest.id = :guestId")
    Optional<AccommodationGuest> findByAccommodationIdAndGuestId(@Param("accommodationId") UUID accommodationId, @Param("guestId") UUID guestId);

    // Trouver tous les hébergements où un utilisateur est invité
    @Query("SELECT ag FROM AccommodationGuest ag WHERE ag.guest.id = :guestId ORDER BY ag.requestedAt DESC")
    List<AccommodationGuest> findByGuestId(@Param("guestId") UUID guestId);
}
