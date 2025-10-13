package com.anasvalisoa.backend.controller;

import com.anasvalisoa.backend.dto.event.EventResponse;
import com.anasvalisoa.backend.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
  private final EventService service;
  public EventController(EventService service){ this.service = service; }

  @GetMapping
  public List<EventResponse> list() {
    return service.listAll();
  }
}
