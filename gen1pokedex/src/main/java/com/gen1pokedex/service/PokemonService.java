package com.gen1pokedex.service;

import com.gen1pokedex.entity.Pokemon;

import java.util.List;

public interface PokemonService {

    // Return a page of pokemons with optional sorting
    List<Pokemon> getAllPokemons(int page, int size, String sort);

    // Load pokemon by database ID
    Pokemon getPokemonById(Long id);

    // Load pokemon by exact name, case insensitive
    Pokemon getByName(String name);

    // Load pokemon by pokedex number
    Pokemon getByNumber(int number); // Keep as int

    // Search pokemons by partial name match
    List<Pokemon> searchByName(String name);

    // Search pokemons with advanced filters
    List<Pokemon> advancedSearch(String name, Integer number, String type, String rarity, String habitat);

    // Filter pokemons by type
    List<Pokemon> filterByType(String typeName);

    // Filter pokemons by habitat
    List<Pokemon> filterByHabitat(String habitat);

    // Filter pokemons by rarity
    List<Pokemon> filterByRarity(String rarity);

    // Create a new pokemon entry
    Pokemon createPokemon(Pokemon pokemon);

    // Update an existing pokemon entry
    Pokemon updatePokemon(Long id, Pokemon updatedPokemon);

    // Delete a pokemon by id
    void deletePokemon(Long id);

    // Pick a random pokemon from the catalog
    Pokemon getRandomPokemon();

    // Suggest names for autocomplete
    List<String> getSuggestions(String prefix);
}