package com.anasvalisoa.backend.repository;

import com.anasvalisoa.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
  List<Event> findAllByOrderByStartsAtAsc();
}
