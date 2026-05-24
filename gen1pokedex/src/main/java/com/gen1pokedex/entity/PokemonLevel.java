package com.gen1pokedex.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity for tracking Pokemon levels and experience points per user.
 * This is separate from User-Pokemon ManyToMany relationship.
 */
@Entity
@Table(name = "pokemon_levels")
public class PokemonLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username; // Who owns this Pokemon

    @Column(name = "pokemon_id", nullable = false)
    private Long pokemonId; // Which Pokemon

    private int level = 1; // Current level (1-100)

    private int experience = 0; // Current XP (0-99, 100 = next level)

    private LocalDateTime lastUpdated;

    // Default constructor
    public PokemonLevel() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getPokemonId() {
        return pokemonId;
    }

    public void setPokemonId(Long pokemonId) {
        this.pokemonId = pokemonId;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}