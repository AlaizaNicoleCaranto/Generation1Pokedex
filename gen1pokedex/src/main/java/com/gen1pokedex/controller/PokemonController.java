package com.gen1pokedex.controller;

import com.gen1pokedex.entity.Pokemon;
import com.gen1pokedex.service.PokemonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controller responsible for public Pokemon browsing, search, and filter endpoints
@RestController
@RequestMapping("/api/pokemons")
public class PokemonController {

    // Service for retrieving and searching Pokemon data
    @Autowired
    private PokemonService pokemonService;

    // List all Pokemon with pagination and optional sorting
    @GetMapping
    public List<Pokemon> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sort) {
        return pokemonService.getAllPokemons(page, size, sort);
    }

    // Retrieve a Pokemon by its database ID
    @GetMapping("/{id}")
    public Pokemon getById(@PathVariable Long id) {
        return pokemonService.getPokemonById(id);
    }

    // Retrieve a Pokemon by its Pokedex number
    @GetMapping("/number/{number}")
    public Pokemon getByNumber(@PathVariable int number) {
        return pokemonService.getByNumber(number);
    }

    // Retrieve a Pokemon by exact name with case-insensitive matching
    @GetMapping("/name/{name}")
    public Pokemon getByName(@PathVariable String name) {
        return pokemonService.getByName(name);
    }

    // Search Pokemon by optional filters such as name, number, type, rarity, or
    // habitat
    @GetMapping("/search")
    public List<Pokemon> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer number,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String rarity,
            @RequestParam(required = false) String habitat) {
        return pokemonService.advancedSearch(name, number, type, rarity, habitat);
    }

    // Filter Pokemon by type name
    @GetMapping("/type/{type}")
    public List<Pokemon> byType(@PathVariable String type) {
        return pokemonService.filterByType(type);
    }

    // Filter Pokemon by rarity category
    @GetMapping("/rarity/{rarity}")
    public List<Pokemon> byRarity(@PathVariable String rarity) {
        return pokemonService.filterByRarity(rarity);
    }

    // Filter Pokemon by habitat category
    @GetMapping("/habitat/{habitat}")
    public List<Pokemon> byHabitat(@PathVariable String habitat) {
        return pokemonService.filterByHabitat(habitat);
    }

    // Return a random Pokemon from the database
    @GetMapping("/random")
    public Pokemon random() {
        return pokemonService.getRandomPokemon();
    }

    // Return name suggestions for autocomplete based on the provided prefix
    @GetMapping("/suggestions")
    public List<String> suggestions(@RequestParam String prefix) {
        return pokemonService.getSuggestions(prefix);
    }
}