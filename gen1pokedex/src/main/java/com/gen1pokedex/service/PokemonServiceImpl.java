package com.gen1pokedex.service;

import com.gen1pokedex.entity.Pokemon; // pokemon domain entity
import com.gen1pokedex.entity.Type; // pokemon type entity
import com.gen1pokedex.exception.PokemonNotFoundException; // thrown for missing pokemon records
import com.gen1pokedex.repository.PokemonRepo; // repository for pokemon persistence
import com.gen1pokedex.repository.TypeRepo; // repository for type lookup
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PokemonServiceImpl implements PokemonService {

    @Autowired
    private PokemonRepo pokemonRepository; // access pokemons for read/write operations

    @Autowired
    private TypeRepo typeRepository; // resolve type objects by name

    @Override
    public List<Pokemon> getAllPokemons(int page, int size, String sort) {
        Sort sortOrder = Sort.by("name");
        if (sort != null && !sort.isBlank()) {
            String[] parts = sort.split(",");
            if (parts.length == 2) {
                sortOrder = Sort.by(Sort.Direction.fromString(parts[1].trim()), parts[0].trim());
            } else {
                sortOrder = Sort.by(sort.trim());
            }
        }
        Pageable pageable = PageRequest.of(page, size, sortOrder);
        return pokemonRepository.findAll(pageable).getContent();
    }

    @Override
    public Pokemon getPokemonById(Long id) {
        return pokemonRepository.findById(id)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found with ID: " + id));
    }

    @Override
    public Pokemon getByName(String name) {
        return pokemonRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + name));
    }

    @Override
    public Pokemon getByNumber(int number) { // Keep as int
        return pokemonRepository.findByPokedexNumber(number)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon number not found: " + number));
    }

    @Override
    public List<Pokemon> searchByName(String name) {
        return pokemonRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Pokemon> advancedSearch(String name, Integer number, String type, String rarity, String habitat) {
        List<Pokemon> results = pokemonRepository.findAll();

        if (name != null && !name.isEmpty()) {
            results = results.stream()
                    .filter(p -> p.getName().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (number != null) {
            results = results.stream()
                    .filter(p -> p.getPokedexNumber() == number)
                    .collect(Collectors.toList());
        }

        if (type != null && !type.isEmpty()) {
            results = results.stream()
                    .filter(p -> p.getTypes().stream().anyMatch(t -> t.getName().equalsIgnoreCase(type)))
                    .collect(Collectors.toList());
        }

        if (rarity != null && !rarity.isEmpty()) {
            results = results.stream()
                    .filter(p -> p.getRarity().equalsIgnoreCase(rarity))
                    .collect(Collectors.toList());
        }

        if (habitat != null && !habitat.isEmpty()) {
            results = results.stream()
                    .filter(p -> p.getHabitat().equalsIgnoreCase(habitat))
                    .collect(Collectors.toList());
        }

        return results;
    }

    @Override
    public List<Pokemon> filterByType(String typeName) {
        Type type = typeRepository.findByNameIgnoreCase(typeName)
                .orElseThrow(() -> new PokemonNotFoundException("Type not found: " + typeName));

        List<Pokemon> result = new ArrayList<>();
        for (Pokemon pokemon : pokemonRepository.findAll()) {
            if (pokemon.getTypes().contains(type)) {
                result.add(pokemon);
            }
        }
        return result;
    }

    @Override
    public List<Pokemon> filterByHabitat(String habitat) {
        return pokemonRepository.findByHabitatIgnoreCase(habitat);
    }

    @Override
    public List<Pokemon> filterByRarity(String rarity) {
        return pokemonRepository.findByRarityIgnoreCase(rarity);
    }

    @Override
    public Pokemon createPokemon(Pokemon pokemon) {
        // Validate that Pokemon is Gen1 (Pokedex numbers 1-151 only)
        if (pokemon.getPokedexNumber() < 1 || pokemon.getPokedexNumber() > 151) {
            throw new IllegalArgumentException("Only Gen1 Pokémon (1-151) can be added to this Pokedex");
        }
        // Check if Pokemon already exists
        if (pokemonRepository.existsByPokedexNumber(pokemon.getPokedexNumber())) {
            throw new IllegalArgumentException("Pokémon #" + pokemon.getPokedexNumber() + " already exists");
        }
        return pokemonRepository.save(pokemon);
    }

    @Override
    public Pokemon updatePokemon(Long id, Pokemon updatedPokemon) {
        Pokemon existing = getPokemonById(id);
        // Validate that Pokémon remains Gen1 if Pokedex number is being changed
        if (updatedPokemon.getPokedexNumber() != existing.getPokedexNumber()) {
            if (updatedPokemon.getPokedexNumber() < 1 || updatedPokemon.getPokedexNumber() > 151) {
                throw new IllegalArgumentException("Cannot change Pokémon number to non-Gen1 value. Gen1 only: 1-151");
            }
        }
        existing.setName(updatedPokemon.getName());
        existing.setHeight(updatedPokemon.getHeight());
        existing.setWeight(updatedPokemon.getWeight());
        existing.setDescription(updatedPokemon.getDescription());
        existing.setHabitat(updatedPokemon.getHabitat());
        existing.setRarity(updatedPokemon.getRarity());
        existing.setTypes(updatedPokemon.getTypes());
        existing.setAbilities(updatedPokemon.getAbilities());
        existing.setHp(updatedPokemon.getHp());
        existing.setAttack(updatedPokemon.getAttack());
        existing.setDefense(updatedPokemon.getDefense());
        existing.setSpeed(updatedPokemon.getSpeed());
        existing.setSpecialAttack(updatedPokemon.getSpecialAttack());
        existing.setSpecialDefense(updatedPokemon.getSpecialDefense());
        return pokemonRepository.save(existing);
    }

    @Override
    public void deletePokemon(Long id) {
        Pokemon pokemon = getPokemonById(id);
        pokemonRepository.delete(pokemon);
    }

    @Override
    public Pokemon getRandomPokemon() {
        List<Pokemon> all = pokemonRepository.findAll();
        if (all.isEmpty())
            throw new PokemonNotFoundException("No Pokémon available");
        return all.get(new Random().nextInt(all.size()));
    }

    @Override
    public List<String> getSuggestions(String prefix) {
        if (prefix == null || prefix.isEmpty()) {
            return List.of();
        }
        List<Pokemon> pokemonList = pokemonRepository.findAll();
        return pokemonList.stream()
                .filter(p -> p.getName().toLowerCase().startsWith(prefix.toLowerCase()))
                .map(Pokemon::getName)
                .limit(10)
                .collect(Collectors.toList());
    }
}