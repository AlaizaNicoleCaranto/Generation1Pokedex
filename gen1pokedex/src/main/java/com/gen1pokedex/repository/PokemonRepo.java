package com.gen1pokedex.repository;

// Import Pokemon entity class for database mapping
import com.gen1pokedex.entity.Pokemon;

// Import Spring Data JPA repository interface for CRUD operations
import org.springframework.data.jpa.repository.JpaRepository;

// Import List for returning multiple Pokemon results
import java.util.List;

// Import Optional for handling null-safe single Pokemon lookups
import java.util.Optional;

// Repository interface for Pokemon database operations
// Extends JpaRepository which provides basic CRUD methods
public interface PokemonRepo extends JpaRepository<Pokemon, Long> {

    // Find a single Pokemon by its exact name, ignoring case sensitivity
    // Example: findByNameIgnoreCase("pikachu") returns Pikachu
    Optional<Pokemon> findByNameIgnoreCase(String name);

    // Find a single Pokemon using its Pokedex number (1-151)
    // Example: findByPokedexNumber(25) returns Pikachu
    Optional<Pokemon> findByPokedexNumber(int number);

    // Search for Pokemon whose name contains the given text, ignoring case
    // Example: findByNameContainingIgnoreCase("char") returns Charmander,
    // Charizard, etc.
    List<Pokemon> findByNameContainingIgnoreCase(String name);

    // Find all Pokemon that live in a specific habitat, ignoring case
    // Example: findByHabitatIgnoreCase("Forest") returns all Forest-dwelling
    // Pokemon
    List<Pokemon> findByHabitatIgnoreCase(String habitat);

    // Check if a Pokemon with given Pokedex number already exists in database
    // Returns true if exists, false if not found
    // Used to prevent duplicate Pokemon entries
    boolean existsByPokedexNumber(int pokedexNumber);

    // Find all Pokemon that have a specific rarity level, ignoring case
    // Example: findByRarityIgnoreCase("Legendary") returns Mewtwo, Mew, etc.
    List<Pokemon> findByRarityIgnoreCase(String rarity);
}