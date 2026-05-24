package com.gen1pokedex.service;

// Import DTO for profile data transfer
import com.gen1pokedex.dto.UserProfileDTO;

// Import entity classes for database models
import com.gen1pokedex.entity.Badge;
import com.gen1pokedex.entity.Pokemon;
import com.gen1pokedex.entity.User;
import com.gen1pokedex.entity.PokemonLevel;

// Import custom exceptions for error handling
import com.gen1pokedex.exception.PokemonNotFoundException;
import com.gen1pokedex.exception.DuplicateResourceException;
import com.gen1pokedex.exception.UserNotFoundException;

// Import repositories for database access
import com.gen1pokedex.repository.PokemonRepo;
import com.gen1pokedex.repository.UserRepo;
import com.gen1pokedex.repository.PokemonLevelRepo;

// Import Spring framework annotations and utilities
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// Import Java utilities
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service implementation for user-related operations.
 * Handles registration, Pokemon catching, favorites, profile management,
 * and the leveling/evolution system.
 */
@Service
public class UserServiceImpl implements UserService {

    // Repository for accessing user data in database
    @Autowired
    private UserRepo userRepository;

    // Repository for accessing Pokemon data in database
    @Autowired
    private PokemonRepo pokemonRepository;

    // Repository for tracking Pokemon levels and XP
    @Autowired
    private PokemonLevelRepo pokemonLevelRepository;

    // Password encoder for secure password storage (BCrypt hashing)
    @Autowired
    private BCryptPasswordEncoder encoder;

    // Service for awarding badges based on user achievements
    @Autowired
    private AchievementService achievementService;

    /**
     * Register a new user with a random starter Pokemon.
     */
    @Override
    public UserProfileDTO registerUser(String username, String password, String email) {
        // Validate input
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty!");
        }

        // Enforce minimum password length for security
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters!");
        }

        // Check if username is already taken
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("Username already exists!");
        }

        // Create new user entity
        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode(password));
        user.setEmail(email);
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());

        // Array of starter Pokemon IDs (Gen1 only) - 9 options for variety
        int[] starters = { 1, 4, 7, 25, 54, 63, 66, 74, 133 };

        // Select random starter from the array
        int starterNum = starters[new Random().nextInt(starters.length)];

        // Fetch the starter Pokemon from database
        Pokemon starter = pokemonRepository.findByPokedexNumber(starterNum)
                .orElseThrow(() -> new PokemonNotFoundException("Starter Pokémon not found"));

        // Add starter to user's collection
        user.getPokemons().add(starter);

        // Save user to database
        User savedUser = userRepository.save(user);

        // Create level tracking record for starter Pokemon
        PokemonLevel level = new PokemonLevel();
        level.setUsername(username);
        level.setPokemonId(starter.getId());
        level.setLevel(1);
        level.setExperience(0);
        level.setLastUpdated(LocalDateTime.now());
        pokemonLevelRepository.save(level);

        // Check and award any badges the user qualifies for
        achievementService.checkAndAwardBadges(savedUser.getUsername());

        // Return user profile DTO
        return mapToProfile(savedUser);
    }

    /**
     * Find a user by their username.
     */
    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }

    /**
     * Add a Pokemon to the user's collection.
     */
    @Override
    @Transactional
    public UserProfileDTO catchPokemon(String username, Long pokemonId) {
        User user = getUserByUsername(username);
        Pokemon pokemon = pokemonRepository.findById(pokemonId)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemonId));

        // Check if already caught (prevent duplicates)
        if (user.getPokemons().contains(pokemon)) {
            throw new RuntimeException("You already caught this Pokémon!");
        }

        // Add Pokemon to collection
        user.getPokemons().add(pokemon);

        // Create level tracking record for the caught Pokemon
        PokemonLevel level = new PokemonLevel();
        level.setUsername(username);
        level.setPokemonId(pokemon.getId());
        level.setLevel(1);
        level.setExperience(0);
        level.setLastUpdated(LocalDateTime.now());
        pokemonLevelRepository.save(level);

        User updatedUser = userRepository.save(user);
        achievementService.checkAndAwardBadges(username);

        return mapToProfile(updatedUser);
    }

    /**
     * Remove a Pokemon from the user's collection.
     */
    @Override
    @Transactional
    public UserProfileDTO releasePokemon(String username, Long pokemonId) {
        User user = getUserByUsername(username);
        Pokemon pokemon = pokemonRepository.findById(pokemonId)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemonId));

        // Remove from collection
        user.getPokemons().remove(pokemon);
        user.getFavorites().remove(pokemon);

        // Delete level tracking record
        pokemonLevelRepository.findByUsernameAndPokemonId(username, pokemonId)
                .ifPresent(pokemonLevelRepository::delete);

        User savedUser = userRepository.save(user);

        return mapToProfile(savedUser);
    }

    /**
     * Get all Pokemon caught by the user.
     */
    @Override
    public Set<Pokemon> getCollection(String username) {
        User user = getUserByUsername(username);
        return user.getPokemons();
    }

    /**
     * Get all Pokemon marked as favorite by the user.
     */
    @Override
    public Set<Pokemon> getFavorites(String username) {
        User user = getUserByUsername(username);
        return user.getFavorites();
    }

    /**
     * Mark a caught Pokemon as favorite.
     */
    @Override
    @Transactional
    public UserProfileDTO addFavorite(String username, Long userPokemonId) {
        User user = getUserByUsername(username);
        Pokemon pokemon = pokemonRepository.findById(userPokemonId)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + userPokemonId));

        if (!user.getPokemons().contains(pokemon)) {
            throw new RuntimeException("You can only favorite Pokemon you have caught!");
        }

        user.getFavorites().add(pokemon);
        User savedUser = userRepository.save(user);
        return mapToProfile(savedUser);
    }

    /**
     * Remove a Pokemon from favorites.
     */
    @Override
    @Transactional
    public UserProfileDTO removeFavorite(String username, Long userPokemonId) {
        User user = getUserByUsername(username);
        Pokemon pokemon = pokemonRepository.findById(userPokemonId)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + userPokemonId));

        user.getFavorites().remove(pokemon);
        User savedUser = userRepository.save(user);
        return mapToProfile(savedUser);
    }

    /**
     * Get user profile with all stats and badges.
     */
    @Override
    public UserProfileDTO getUserProfile(String username) {
        User user = getUserByUsername(username);
        return mapToProfile(user);
    }

    /**
     * Get top 10 users sorted by number of Pokemon caught.
     */
    @Override
    public List<UserProfileDTO> getLeaderboard() {
        return userRepository.findAll().stream()
                .sorted((u1, u2) -> Integer.compare(u2.getPokemons().size(), u1.getPokemons().size()))
                .limit(10)
                .map(this::mapToProfile)
                .collect(Collectors.toList());
    }

    /**
     * Update user's email and/or bio.
     */
    @Override
    @Transactional
    public UserProfileDTO updateUserProfile(String username, String email, String bio) {
        User user = getUserByUsername(username);

        if (email != null) {
            user.setEmail(email);
        }
        if (bio != null) {
            user.setBio(bio);
        }
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return mapToProfile(savedUser);
    }

    /**
     * Get all badges earned by the user.
     */
    @Override
    public List<Badge> getUserBadges(String username) {
        return achievementService.getUserBadges(username);
    }

    /**
     * Get a random user profile.
     */
    @Override
    public UserProfileDTO getRandomUser() {
        List<User> allUsers = userRepository.findAll();
        if (allUsers.isEmpty()) {
            throw new RuntimeException("No users available");
        }
        return mapToProfile(allUsers.get(new Random().nextInt(allUsers.size())));
    }

    /**
     * Calculate Pokedex completion percentage.
     */
    @Override
    public double getCompletionPercentage(String username) {
        User user = getUserByUsername(username);
        int caughtCount = user.getPokemons().size();
        return (caughtCount / 151.0) * 100;
    }

    /**
     * Level up a Pokemon - Saves level to database.
     */
    @Override
    public UserProfileDTO levelUpPokemon(String username, Long pokemonId, int experienceGain) {
        try {
            User user = getUserByUsername(username);
            Pokemon pokemon = pokemonRepository.findById(pokemonId)
                    .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemonId));

            if (!user.getPokemons().contains(pokemon)) {
                throw new RuntimeException("Pokemon not found in your collection");
            }

            // Get existing level data or create new record
            PokemonLevel level = pokemonLevelRepository.findByUsernameAndPokemonId(username, pokemonId)
                    .orElse(new PokemonLevel());

            if (level.getId() == null) {
                level.setUsername(username);
                level.setPokemonId(pokemonId);
                level.setLevel(1);
                level.setExperience(0);
                level.setLastUpdated(LocalDateTime.now());
            }

            // Add experience and calculate new level (100 XP per level)
            int newExp = level.getExperience() + experienceGain;
            int newLevel = level.getLevel();

            // Level up loop - removed unused levelsGained variable
            while (newExp >= 100) {
                newExp -= 100;
                newLevel++;
            }

            level.setExperience(newExp);
            level.setLevel(newLevel);
            level.setLastUpdated(LocalDateTime.now());

            pokemonLevelRepository.save(level);

            // Log level up message
            System.out.println("✅ " + username + "'s " + pokemon.getName() +
                    " gained " + experienceGain + " XP! " +
                    "Now Level " + newLevel + " (" + newExp + "/100 XP)");

            return mapToProfile(user);
        } catch (Exception e) {
            System.err.println("Error in levelUpPokemon: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to level up Pokemon: " + e.getMessage());
        }
    }

    /**
     * Get Pokemon level from database.
     * FIXED: Added better null handling and auto-create missing records
     */
    @Override
    public int getPokemonLevel(String username, Long pokemonId) {
        try {
            User user = getUserByUsername(username);
            Pokemon pokemon = pokemonRepository.findById(pokemonId)
                    .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemonId));

            if (!user.getPokemons().contains(pokemon)) {
                throw new RuntimeException("Pokemon not found in your collection");
            }

            // Return actual level from database, default to 1
            Optional<PokemonLevel> levelOpt = pokemonLevelRepository.findByUsernameAndPokemonId(username, pokemonId);
            if (levelOpt.isPresent()) {
                return levelOpt.get().getLevel();
            } else {
                // Create a default level record if not exists
                PokemonLevel newLevel = new PokemonLevel();
                newLevel.setUsername(username);
                newLevel.setPokemonId(pokemonId);
                newLevel.setLevel(1);
                newLevel.setExperience(0);
                newLevel.setLastUpdated(LocalDateTime.now());
                pokemonLevelRepository.save(newLevel);
                return 1;
            }
        } catch (Exception e) {
            System.err.println("Error in getPokemonLevel: " + e.getMessage());
            e.printStackTrace();
            return 1; // Default to level 1 on error
        }
    }

    /**
     * Evolve Pokemon - preserves level data.
     */
    @Override
    public UserProfileDTO evolvePokemon(String username, Long pokemonId) {
        User user = getUserByUsername(username);
        Pokemon currentPokemon = pokemonRepository.findById(pokemonId)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemonId));

        if (!user.getPokemons().contains(currentPokemon)) {
            throw new RuntimeException("Pokemon not found in your collection");
        }

        int currentLevel = getPokemonLevel(username, pokemonId);
        Pokemon evolvedForm = getEvolvedForm(currentPokemon, currentLevel);

        if (evolvedForm != null) {
            // Get level data before removal
            PokemonLevel oldLevel = pokemonLevelRepository.findByUsernameAndPokemonId(username, pokemonId).orElse(null);

            // Remove current Pokemon
            user.getPokemons().remove(currentPokemon);
            user.getFavorites().remove(currentPokemon);

            // Add evolved Pokemon
            user.getPokemons().add(evolvedForm);

            // Transfer level data to evolved Pokemon
            if (oldLevel != null) {
                pokemonLevelRepository.delete(oldLevel);

                PokemonLevel newLevel = new PokemonLevel();
                newLevel.setUsername(username);
                newLevel.setPokemonId(evolvedForm.getId());
                newLevel.setLevel(oldLevel.getLevel());
                newLevel.setExperience(oldLevel.getExperience());
                newLevel.setLastUpdated(LocalDateTime.now());
                pokemonLevelRepository.save(newLevel);
            }

            userRepository.save(user);

            System.out.println("✨ " + username + "'s " + currentPokemon.getName() +
                    " evolved into " + evolvedForm.getName() + "!");
        } else {
            System.out.println("⚠️ " + currentPokemon.getName() + " cannot evolve at level " + currentLevel);
        }

        return mapToProfile(user);
    }

    /**
     * Helper method to determine if a Pokemon can evolve.
     */
    private Pokemon getEvolvedForm(Pokemon pokemon, int level) {
        String pokemonName = pokemon.getName();

        if (pokemonName.equalsIgnoreCase("Bulbasaur") && level >= 16) {
            return pokemonRepository.findByNameIgnoreCase("Ivysaur").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Ivysaur") && level >= 32) {
            return pokemonRepository.findByNameIgnoreCase("Venusaur").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Charmander") && level >= 16) {
            return pokemonRepository.findByNameIgnoreCase("Charmeleon").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Charmeleon") && level >= 36) {
            return pokemonRepository.findByNameIgnoreCase("Charizard").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Squirtle") && level >= 16) {
            return pokemonRepository.findByNameIgnoreCase("Wartortle").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Wartortle") && level >= 36) {
            return pokemonRepository.findByNameIgnoreCase("Blastoise").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Caterpie") && level >= 7) {
            return pokemonRepository.findByNameIgnoreCase("Metapod").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Metapod") && level >= 10) {
            return pokemonRepository.findByNameIgnoreCase("Butterfree").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Weedle") && level >= 7) {
            return pokemonRepository.findByNameIgnoreCase("Kakuna").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Kakuna") && level >= 10) {
            return pokemonRepository.findByNameIgnoreCase("Beedrill").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Pidgey") && level >= 18) {
            return pokemonRepository.findByNameIgnoreCase("Pidgeotto").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Pidgeotto") && level >= 36) {
            return pokemonRepository.findByNameIgnoreCase("Pidgeot").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Pikachu") && level >= 36) {
            return pokemonRepository.findByNameIgnoreCase("Raichu").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Geodude") && level >= 36) {
            return pokemonRepository.findByNameIgnoreCase("Graveler").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Graveler") && level >= 45) {
            return pokemonRepository.findByNameIgnoreCase("Golem").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Abra") && level >= 16) {
            return pokemonRepository.findByNameIgnoreCase("Kadabra").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Kadabra") && level >= 36) {
            return pokemonRepository.findByNameIgnoreCase("Alakazam").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Machop") && level >= 28) {
            return pokemonRepository.findByNameIgnoreCase("Machoke").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Machoke") && level >= 36) {
            return pokemonRepository.findByNameIgnoreCase("Machamp").orElse(null);
        }
        if (pokemonName.equalsIgnoreCase("Eevee") && level >= 36) {
            return pokemonRepository.findByNameIgnoreCase("Vaporeon").orElse(null);
        }

        return null;
    }

    /**
     * Convert User entity to UserProfileDTO.
     */
    private UserProfileDTO mapToProfile(User user) {
        UserProfileDTO profile = new UserProfileDTO();
        profile.setUsername(user.getUsername());
        profile.setRole(user.getRole());
        profile.setEmail(user.getEmail());
        profile.setBio(user.getBio());
        profile.setPokemonCount(user.getPokemons().size());
        profile.setFavoriteCount(user.getFavorites().size());
        profile.setCompletionPercentage(getCompletionPercentage(user.getUsername()));
        profile.setBadges(achievementService.getUserBadges(user.getUsername()));
        profile.setStatus(user.getStatus() != null ? user.getStatus().toString() : "ACTIVE");
        return profile;
    }
}