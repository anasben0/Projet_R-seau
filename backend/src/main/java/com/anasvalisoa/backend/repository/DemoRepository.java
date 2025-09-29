package com.anasvalisoa.backend.repository;

import com.anasvalisoa.backend.entity.Demo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DemoRepository extends JpaRepository<Demo, Long> { }
