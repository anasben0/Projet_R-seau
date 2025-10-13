package com.anasvalisoa.backend.service;

import com.anasvalisoa.backend.dto.event.EventResponse;
import com.anasvalisoa.backend.entity.Event;
import com.anasvalisoa.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
  private final EventRepository repo;
  public EventService(EventRepository repo){ this.repo = repo; }

  public List<EventResponse> listAll() {
    return repo.findAllByOrderByStartsAtAsc().stream().map(this::toResponse).toList();
  }

  private EventResponse toResponse(Event e) {
    return new EventResponse(
      e.getId(),
      e.getName(),
      e.getAddress(),
      e.getRoom(),
      e.getStartsAt(),
      e.getEndsAt()
    );
  }
}
