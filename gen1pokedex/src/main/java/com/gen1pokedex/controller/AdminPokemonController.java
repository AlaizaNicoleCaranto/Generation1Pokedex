package com.gen1pokedex.controller;

import com.gen1pokedex.entity.Pokemon;
import com.gen1pokedex.service.PokemonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controller for admin Pokemon management actions such as creating, updating, and deleting entries
@RestController
@RequestMapping("/api/admin/pokemons")
public class AdminPokemonController {

    // Service for admin-level Pokemon management
    @Autowired
    private PokemonService pokemonService;

    // Create a new Pokemon entry in the global Pokedex
    @PostMapping
    public Pokemon addPokemon(@RequestBody Pokemon pokemon) {
        return pokemonService.createPokemon(pokemon);
    }

    // Update an existing Pokemon by database ID
    @PutMapping("/{id}")
    public Pokemon updatePokemon(@PathVariable Long id, @RequestBody Pokemon pokemon) {
        return pokemonService.updatePokemon(id, pokemon);
    }

    // Delete a Pokemon by database ID
    @DeleteMapping("/{id}")
    public String deletePokemon(@PathVariable Long id) {
        pokemonService.deletePokemon(id);
        return "Pokemon with ID " + id + " deleted successfully";
    }

    // List all Pokemon for admin purposes with pagination and sorting
    @GetMapping
    public List<Pokemon> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sort) {
        return pokemonService.getAllPokemons(page, size, sort);
    }
}