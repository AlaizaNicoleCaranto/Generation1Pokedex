package com.gen1pokedex.repository;

import com.gen1pokedex.entity.Type;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeRepo extends JpaRepository<Type, Long> {

    // Find a Pokémon type by its name, ignoring case
    Optional<Type> findByNameIgnoreCase(String name);
}