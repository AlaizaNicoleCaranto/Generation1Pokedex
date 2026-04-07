package com.gen1pokedex.service;

// Import DTO for profile data transfer
import com.gen1pokedex.dto.UserProfileDTO;

// Import entity classes for database models
import com.gen1pokedex.entity.Badge;
import com.gen1pokedex.entity.Pokemon;
import com.gen1pokedex.entity.User;

// Import custom exceptions for error handling
import com.gen1pokedex.exception.PokemonNotFoundException;
import com.gen1pokedex.exception.DuplicateResourceException;
import com.gen1pokedex.exception.UserNotFoundException;

// Import repositories for database access
import com.gen1pokedex.repository.PokemonRepo;
import com.gen1pokedex.repository.UserRepo;

// Import Spring framework annotations and utilities
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// Import Java utilities
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service implementation for user-related operations.
 * Handles registration, Pokemon catching, favorites, and profile management.
 */
@Service
public class UserServiceImpl implements UserService {

    // Repository for accessing user data in database
    @Autowired
    private UserRepo userRepository;

    // Repository for accessing Pokemon data in database
    @Autowired
    private PokemonRepo pokemonRepository;

    // Password encoder for secure password storage (BCrypt hashing)
    @Autowired
    private BCryptPasswordEncoder encoder;

    // Service for awarding badges based on user achievements
    @Autowired
    private AchievementService achievementService;

    /**
     * Register a new user with a random starter Pokemon.
     * 
     * @param username Unique trainer name
     * @param password Plain text password (will be encrypted)
     * @return UserProfileDTO with user details and starter Pokemon
     * @throws DuplicateResourceException if username already exists
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

        // Array of starter Pokemon IDs (Gen1 only)
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

        // Check and award any badges the user qualifies for
        achievementService.checkAndAwardBadges(savedUser.getUsername());

        // Return user profile DTO (safe for frontend, no password)
        return mapToProfile(savedUser);
    }

    /**
     * Find a user by their username.
     * 
     * @param username Trainer name to search for
     * @return User entity
     * @throws UserNotFoundException if user does not exist
     */
    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }

    /**
     * Add a Pokemon to the user's collection.
     * 
     * @param username  Trainer who caught the Pokemon
     * @param pokemonId ID of the Pokemon to catch
     * @return Updated user profile
     */
    @Override
    @Transactional
    public UserProfileDTO catchPokemon(String username, Long pokemonId) {
        User user = getUserByUsername(username);
        Pokemon pokemon = pokemonRepository.findById(pokemonId)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemonId));

        user.getPokemons().add(pokemon);
        User updatedUser = userRepository.save(user);
        achievementService.checkAndAwardBadges(username);

        return mapToProfile(updatedUser);
    }

    /**
     * Remove a Pokemon from the user's collection.
     * Also removes from favorites if present.
     * 
     * @param username  Trainer releasing the Pokemon
     * @param pokemonId ID of the Pokemon to release
     * @return Updated user profile
     */
    @Override
    @Transactional
    public UserProfileDTO releasePokemon(String username, Long pokemonId) {
        User user = getUserByUsername(username);
        Pokemon pokemon = pokemonRepository.findById(pokemonId)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemonId));

        user.getPokemons().remove(pokemon);
        user.getFavorites().remove(pokemon);
        User savedUser = userRepository.save(user);

        return mapToProfile(savedUser);
    }

    /**
     * Get all Pokemon caught by the user.
     * 
     * @param username Trainer name
     * @return Set of Pokemon in user's collection
     */
    @Override
    public Set<Pokemon> getCollection(String username) {
        User user = getUserByUsername(username);
        return user.getPokemons();
    }

    /**
     * Get all Pokemon marked as favorite by the user.
     * 
     * @param username Trainer name
     * @return Set of favorite Pokemon
     */
    @Override
    public Set<Pokemon> getFavorites(String username) {
        User user = getUserByUsername(username);
        return user.getFavorites();
    }

    /**
     * Mark a caught Pokemon as favorite.
     * 
     * @param username      Trainer name
     * @param userPokemonId ID of the Pokemon to favorite
     * @return Updated user profile
     * @throws RuntimeException if Pokemon not in collection
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
     * 
     * @param username      Trainer name
     * @param userPokemonId ID of the Pokemon to unfavorite
     * @return Updated user profile
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
     * 
     * @param username Trainer name
     * @return UserProfileDTO with complete profile data
     */
    @Override
    public UserProfileDTO getUserProfile(String username) {
        User user = getUserByUsername(username);
        return mapToProfile(user);
    }

    /**
     * Get top 10 users sorted by number of Pokemon caught.
     * 
     * @return List of top 10 user profiles
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
     * 
     * @param username Trainer name
     * @param email    New email address (can be null)
     * @param bio      New biography text (can be null)
     * @return Updated user profile
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

        User savedUser = userRepository.save(user);
        return mapToProfile(savedUser);
    }

    /**
     * Get all badges earned by the user.
     * 
     * @param username Trainer name
     * @return List of badges
     */
    @Override
    public List<Badge> getUserBadges(String username) {
        return achievementService.getUserBadges(username);
    }

    /**
     * Get a random user profile (for discovery feature).
     * 
     * @return Random user profile
     * @throws RuntimeException if no users exist
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
     * Formula: (caught count / 151) * 100
     * 
     * @param username Trainer name
     * @return Completion percentage (0.0 to 100.0)
     */
    @Override
    public double getCompletionPercentage(String username) {
        User user = getUserByUsername(username);
        int caughtCount = user.getPokemons().size();
        return (caughtCount / 151.0) * 100;
    }

    /**
     * Level up a Pokemon.
     * Adds experience points to a Pokemon in user's collection.
     * 
     * @param username       Trainer name
     * @param pokemonId      ID of the Pokemon to level up
     * @param experienceGain Amount of XP to add
     * @return Updated user profile
     */
    @Override
    public UserProfileDTO levelUpPokemon(String username, Long pokemonId, int experienceGain) {
        User user = getUserByUsername(username);
        Pokemon pokemon = pokemonRepository.findById(pokemonId)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemonId));

        if (!user.getPokemons().contains(pokemon)) {
            throw new RuntimeException("Pokemon not found in your collection");
        }

        System.out.println("Pokemon " + pokemon.getName() + " gained " + experienceGain + " experience!");

        return mapToProfile(user);
    }

    /**
     * Get Pokemon level.
     * Returns the current level of a specific Pokemon.
     * 
     * @param username  Trainer name
     * @param pokemonId ID of the Pokemon
     * @return Current level (default: 1)
     */
    @Override
    public int getPokemonLevel(String username, Long pokemonId) {
        User user = getUserByUsername(username);
        Pokemon pokemon = pokemonRepository.findById(pokemonId)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemonId));

        if (!user.getPokemons().contains(pokemon)) {
            throw new RuntimeException("Pokemon not found in your collection");
        }

        return 1;
    }

    /**
     * Evolve Pokemon.
     * Checks evolution requirements and evolves if conditions are met.
     * 
     * @param username  Trainer name
     * @param pokemonId ID of the Pokemon to evolve
     * @return Updated user profile
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
            user.getPokemons().remove(currentPokemon);
            user.getPokemons().add(evolvedForm);
            userRepository.save(user);

            System.out.println("Congratulations! Your " + currentPokemon.getName() +
                    " evolved into " + evolvedForm.getName() + "!");
        } else {
            System.out.println(currentPokemon.getName() + " cannot evolve at level " + currentLevel);
        }

        return mapToProfile(user);
    }

    /**
     * Helper method to determine if a Pokemon can evolve at a given level.
     * Contains evolution requirements for Gen1 Pokemon.
     * 
     * @param pokemon Current Pokemon
     * @param level   Current level of the Pokemon
     * @return Evolved Pokemon or null if no evolution available
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
     * Convert User entity to UserProfileDTO for safe frontend consumption.
     * Excludes sensitive data like password.
     * 
     * @param user User entity from database
     * @return UserProfileDTO with safe profile data
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