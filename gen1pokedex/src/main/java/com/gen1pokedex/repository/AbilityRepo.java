package com.gen1pokedex.repository;

import com.gen1pokedex.entity.Ability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AbilityRepo extends JpaRepository<Ability, Long> {
    // Find an ability entity using a case-insensitive match on its name
    Optional<Ability> findByNameIgnoreCase(String name);
}