package com.anasvalisoa.backend.repository;

import com.anasvalisoa.backend.entity.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, UUID> {

    // Trouver tous les hébergements d'un événement
    @Query("SELECT a FROM Accommodation a WHERE a.event.id = :eventId ORDER BY a.createdAt DESC")
    List<Accommodation> findByEventId(@Param("eventId") UUID eventId);

    // Trouver tous les hébergements créés par un host
    @Query("SELECT a FROM Accommodation a WHERE a.host.id = :hostId ORDER BY a.createdAt DESC")
    List<Accommodation> findByHostId(@Param("hostId") UUID hostId);

    // Vérifier si un hébergement existe pour un événement et un host
    boolean existsByEventIdAndHostId(UUID eventId, UUID hostId);
}
