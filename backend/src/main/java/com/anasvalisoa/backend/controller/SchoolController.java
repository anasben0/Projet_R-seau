package com.anasvalisoa.backend.controller;

import com.anasvalisoa.backend.entity.School;
import com.anasvalisoa.backend.repository.SchoolRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {

    private final SchoolRepository schoolRepository;

    public SchoolController(SchoolRepository schoolRepository) {
        this.schoolRepository = schoolRepository;
    }

    @GetMapping
    public ResponseEntity<List<School>> getAllSchools() {
        List<School> schools = schoolRepository.findAll();
        return ResponseEntity.ok(schools);
    }

    @PostMapping
    public ResponseEntity<School> createSchool(@RequestBody School school) {
        if (schoolRepository.existsByName(school.getName())) {
            return ResponseEntity.badRequest().build();
        }
        School savedSchool = schoolRepository.save(school);
        return ResponseEntity.ok(savedSchool);
    }
}
