package com.anasvalisoa.backend.repository;

import com.anasvalisoa.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findAllByOrderByStartsAtAsc();
    
    List<Event> findBySchoolIdOrderByStartsAtAsc(UUID schoolId);
    
    @Query("SELECT e FROM Event e WHERE e.startsAt >= :now ORDER BY e.startsAt ASC")
    List<Event> findUpcomingEvents(@Param("now") OffsetDateTime now);
    
    @Query("SELECT e FROM Event e WHERE e.schoolId = :schoolId AND e.startsAt >= :now ORDER BY e.startsAt ASC")
    List<Event> findUpcomingEventsBySchool(@Param("schoolId") UUID schoolId, @Param("now") OffsetDateTime now);
    
    List<Event> findByCreatedByOrderByCreatedAtDesc(UUID createdBy);
}
