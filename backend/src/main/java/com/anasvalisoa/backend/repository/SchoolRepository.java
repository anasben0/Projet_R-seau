package com.anasvalisoa.backend.repository;

import com.anasvalisoa.backend.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SchoolRepository extends JpaRepository<School, UUID> {
    Optional<School> findByName(String name);
    boolean existsByName(String name);
}
