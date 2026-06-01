package com.gen1pokedex.controller;

import com.gen1pokedex.dto.AuthRequest;
import com.gen1pokedex.dto.UserProfileDTO;
import com.gen1pokedex.dto.UserProfileUpdateRequest;
import com.gen1pokedex.entity.Badge;
import com.gen1pokedex.entity.Pokemon;
import com.gen1pokedex.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Register new user with JSON request body
    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public UserProfileDTO register(@RequestBody AuthRequest authRequest) {
        return userService.registerUser(authRequest.getUsername(), authRequest.getPassword(), authRequest.getEmail());
    }

    // Get user profile with progress
    @GetMapping("/{username}/profile")
    public UserProfileDTO profile(@PathVariable String username) {
        return userService.getUserProfile(username);
    }

    // Catch Pokémon
    @PostMapping("/{username}/catch/{pokemonId}")
    public UserProfileDTO catchPokemon(
            @PathVariable String username,
            @PathVariable Long pokemonId) {
        return userService.catchPokemon(username, pokemonId);
    }

    // Release Pokémon from the user's collection by Pokemon ID
    @DeleteMapping("/{username}/release/{userPokemonId}")
    public UserProfileDTO releasePokemon(
            @PathVariable String username,
            @PathVariable Long userPokemonId) {
        return userService.releasePokemon(username, userPokemonId);
    }

    // List caught Pokémon
    @GetMapping("/{username}/collection")
    public Set<Pokemon> collection(@PathVariable String username) {
        return userService.getCollection(username);
    }

    // List favorite Pokémon
    @GetMapping("/{username}/favorites")
    public Set<Pokemon> favorites(@PathVariable String username) {
        return userService.getFavorites(username);
    }

    // List earned badges separately for the user
    @GetMapping("/{username}/badges")
    public List<Badge> badges(@PathVariable String username) {
        return userService.getUserBadges(username);
    }

    // NEW ENDPOINTS:

    // Add to favorites by Pokemon ID from the user's collection
    @PostMapping("/{username}/favorite/{userPokemonId}")
    public UserProfileDTO addFavorite(
            @PathVariable String username,
            @PathVariable Long userPokemonId) {
        return userService.addFavorite(username, userPokemonId);
    }

    // Remove from favorites by Pokemon ID
    @DeleteMapping("/{username}/favorite/{userPokemonId}")
    public UserProfileDTO removeFavorite(
            @PathVariable String username,
            @PathVariable Long userPokemonId) {
        return userService.removeFavorite(username, userPokemonId);
    }

    // Get leaderboard
    @GetMapping("/leaderboard")
    public List<UserProfileDTO> leaderboard() {
        return userService.getLeaderboard();
    }

    // Get random user
    @GetMapping("/random")
    public UserProfileDTO randomUser() {
        return userService.getRandomUser();
    }

    // Update user profile using JSON payload
    @PutMapping("/{username}/profile")
    public UserProfileDTO updateProfile(
            @PathVariable String username,
            @RequestBody UserProfileUpdateRequest updateRequest) {
        return userService.updateUserProfile(username, updateRequest.getEmail(), updateRequest.getBio());
    }

    // Get completion percentage
    @GetMapping("/{username}/completion")
    public double getCompletion(@PathVariable String username) {
        return userService.getCompletionPercentage(username);
    }

    // Get the level and XP of a specific Pokemon in user's collection
    @GetMapping("/{username}/pokemon/{pokemonId}/level")
    public int getPokemonLevel(@PathVariable String username, @PathVariable Long pokemonId) {
        return userService.getPokemonLevel(username, pokemonId);
    }
}