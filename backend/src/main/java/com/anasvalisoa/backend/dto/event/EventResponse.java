package com.anasvalisoa.backend.dto.event;

import java.time.OffsetDateTime;
import java.util.UUID;

public record EventResponse(
  UUID id,
  String name,
  String address,
  String room,
  OffsetDateTime startsAt,
  OffsetDateTime endsAt
) {}
