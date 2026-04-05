package com.gen1pokedex.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "abilities")
public class Ability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // primary key for ability records

    private String name; // ability name like "Overgrow" or "Blaze"

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}