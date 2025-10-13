package com.anasvalisoa.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "events")
public class Event {
  @Id
  private UUID id;

  @Column(name = "school_id", nullable = false)
  private UUID schoolId;

  @Column(nullable = false)
  private String name;

  private String activities;
  @Column(name = "starts_at", nullable = false)
  private OffsetDateTime startsAt;
  @Column(name = "ends_at")
  private OffsetDateTime endsAt;

  private String address;   
  private String room;     

  @Column(name = "created_by", nullable = false)
  private UUID createdBy;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  // getters/setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public UUID getSchoolId() { return schoolId; }
  public void setSchoolId(UUID schoolId) { this.schoolId = schoolId; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getActivities() { return activities; }
  public void setActivities(String activities) { this.activities = activities; }
  public OffsetDateTime getStartsAt() { return startsAt; }
  public void setStartsAt(OffsetDateTime startsAt) { this.startsAt = startsAt; }
  public OffsetDateTime getEndsAt() { return endsAt; }
  public void setEndsAt(OffsetDateTime endsAt) { this.endsAt = endsAt; }
  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }
  public String getRoom() { return room; }
  public void setRoom(String room) { this.room = room; }
  public UUID getCreatedBy() { return createdBy; }
  public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
