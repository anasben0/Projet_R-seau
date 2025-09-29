package com.anasvalisoa.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "demo")
public class Demo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    public Demo() {}

    public Demo(String name) { this.name = name; }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
