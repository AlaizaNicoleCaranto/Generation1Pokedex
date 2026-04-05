package com.gen1pokedex.service;

// Import DTO for user profile data transfer
import com.gen1pokedex.dto.UserProfileDTO;

// Import entity classes for badges and Pokemon
import com.gen1pokedex.entity.Badge;
import com.gen1pokedex.entity.Pokemon;
import com.gen1pokedex.entity.User;

// Import Java collections
import java.util.List;
import java.util.Set;

/**
 * Service interface for user-related operations.
 * Defines all methods that handle user gameplay and profile management.
 */
public interface UserService {

    /**
     * Register a new trainer with a random starter Pokemon.
     * 
     * @param username Unique trainer name chosen by user
     * @param password Plain text password (will be encrypted before storage)
     * @return UserProfileDTO containing user details and starter Pokemon
     * @throws com.gen1pokedex.exception.DuplicateResourceException if username already exists
     */
    UserProfileDTO registerUser(String username, String password);

    /**
     * Load a User entity by username from the database.
     * Used internally by other service methods.
     * 
     * @param username Trainer name to search for
     * @return User entity with complete data
     * @throws com.gen1pokedex.exception.UserNotFoundException if user not found
     */
    User getUserByUsername(String username);

    /**
     * Add a Pokemon to the user's collection.
     * Triggered when a trainer successfully catches a Pokemon.
     * 
     * @param username Trainer who caught the Pokemon
     * @param pokemonId Database ID of the Pokemon to add
     * @return Updated user profile with new Pokemon count
     * @throws com.gen1pokedex.exception.PokemonNotFoundException if Pokemon ID invalid
     */
    UserProfileDTO catchPokemon(String username, Long pokemonId);

    /**
     * Remove a Pokemon from the user's collection.
     * Also removes from favorites if the Pokemon was favorited.
     * 
     * @param username Trainer releasing the Pokemon
     * @param pokemonId Database ID of the Pokemon to remove
     * @return Updated user profile with reduced Pokemon count
     * @throws com.gen1pokedex.exception.PokemonNotFoundException if Pokemon ID invalid
     */
    UserProfileDTO releasePokemon(String username, Long pokemonId);

    /**
     * Get all Pokemon currently in the user's collection.
     * 
     * @param username Trainer name
     * @return Set of Pokemon objects (no duplicates, order not guaranteed)
     * @throws com.gen1pokedex.exception.UserNotFoundException if user not found
     */
    Set<Pokemon> getCollection(String username);

    /**
     * Get all Pokemon marked as favorites by the user.
     * 
     * @param username Trainer name
     * @return Set of favorite Pokemon (subset of collection)
     * @throws com.gen1pokedex.exception.UserNotFoundException if user not found
     */
    Set<Pokemon> getFavorites(String username);

    /**
     * Mark a caught Pokemon as favorite.
     * Pokemon must already be in user's collection.
     * 
     * @param username Trainer name
     * @param userPokemonId Database ID of the Pokemon to favorite
     * @return Updated user profile with increased favorite count
     * @throws RuntimeException if Pokemon not in user's collection
     */
    UserProfileDTO addFavorite(String username, Long userPokemonId);

    /**
     * Remove a Pokemon from favorites.
     * Pokemon remains in collection, just removed from favorites list.
     * 
     * @param username Trainer name
     * @param userPokemonId Database ID of the Pokemon to unfavorite
     * @return Updated user profile with decreased favorite count
     */
    UserProfileDTO removeFavorite(String username, Long userPokemonId);

    /**
     * Get complete user profile with stats and badges.
     * Returns safe DTO without sensitive information like password.
     * 
     * @param username Trainer name
     * @return UserProfileDTO with profile data, collection stats, and badges
     * @throws com.gen1pokedex.exception.UserNotFoundException if user not found
     */
    UserProfileDTO getUserProfile(String username);

    /**
     * Get top 10 trainers sorted by number of Pokemon caught.
     * Used for leaderboard display.
     * 
     * @return List of top 10 user profiles, sorted descending by Pokemon count
     */
    List<UserProfileDTO> getLeaderboard();

    /**
     * Update user's email address and/or biography.
     * Only updates fields that are provided (non-null values).
     * 
     * @param username Trainer name
     * @param email New email address (can be null to skip update)
     * @param bio New biography text (can be null to skip update)
     * @return Updated user profile with new email/bio
     */
    UserProfileDTO updateUserProfile(String username, String email, String bio);

    /**
     * Get all badges earned by the user.
     * Badges are automatically awarded based on achievements.
     * 
     * @param username Trainer name
     * @return List of badges earned, empty list if none
     */
    List<Badge> getUserBadges(String username);

    /**
     * Get a random user profile for discovery features.
     * Useful for showing random trainers on the frontend.
     * 
     * @return Random user profile from database
     * @throws RuntimeException if no users exist in database
     */
    UserProfileDTO getRandomUser();

    /**
     * Calculate Pokedex completion percentage.
     * Formula: (caught count / total Gen1 Pokemon) * 100
     * 
     * @param username Trainer name
     * @return Completion percentage between 0.0 and 100.0
     */
    double getCompletionPercentage(String username);

    /**
     * Level up a specific Pokemon in user's collection.
     * Adds experience points and increases level when threshold is reached.
     * 
     * @param username Trainer name
     * @param pokemonId ID of the Pokemon to level up
     * @param experienceGain Amount of experience points to add
     * @return Updated user profile
     * @throws RuntimeException if Pokemon not in user's collection
     */
    UserProfileDTO levelUpPokemon(String username, Long pokemonId, int experienceGain);

    /**
     * Get the current level of a specific Pokemon in user's collection.
     * 
     * @param username Trainer name
     * @param pokemonId ID of the Pokemon to check
     * @return Current level (minimum 1, maximum 100)
     * @throws RuntimeException if Pokemon not in user's collection
     */
    int getPokemonLevel(String username, Long pokemonId);

    /**
     * Evolve a Pokemon if it meets level requirements.
     * Checks evolution conditions and replaces Pokemon with evolved form.
     * 
     * @param username Trainer name
     * @param pokemonId ID of the Pokemon to evolve
     * @return Updated user profile with evolved Pokemon
     * @throws RuntimeException if Pokemon not in collection or cannot evolve
     */
    UserProfileDTO evolvePokemon(String username, Long pokemonId);
}