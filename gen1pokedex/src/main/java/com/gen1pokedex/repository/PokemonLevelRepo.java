package com.gen1pokedex.repository;

import com.gen1pokedex.entity.PokemonLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository for Pokemon level tracking.
 */
public interface PokemonLevelRepo extends JpaRepository<PokemonLevel, Long> {

    // Find level data for a specific Pokemon owned by a user
    Optional<PokemonLevel> findByUsernameAndPokemonId(String username, Long pokemonId);
}