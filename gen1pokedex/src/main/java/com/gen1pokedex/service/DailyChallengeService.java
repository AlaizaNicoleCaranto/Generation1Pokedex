package com.gen1pokedex.service;

// Import DTO for daily challenge data transfer
import com.gen1pokedex.dto.DailyChallengeDTO;

// Import domain entities for database mapping
import com.gen1pokedex.entity.DailyChallenge;
import com.gen1pokedex.entity.Pokemon;
import com.gen1pokedex.entity.User;
import com.gen1pokedex.entity.UserDailyChallenge;

// Import custom exception for Pokemon not found
import com.gen1pokedex.exception.PokemonNotFoundException;

// Import repositories for database operations
import com.gen1pokedex.repository.DailyChallengeRepo;
import com.gen1pokedex.repository.PokemonRepo;
import com.gen1pokedex.repository.UserDailyChallengeRepo;
import com.gen1pokedex.repository.UserRepo;

// Import Spring annotations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Import date and time classes for daily challenge scheduling
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

// Service class that manages daily Pokemon challenges and streak tracking
@Service
public class DailyChallengeService {

    // Repository for storing daily challenge definitions
    @Autowired
    private DailyChallengeRepo dailyChallengeRepository;

    // Repository for tracking user challenge completions and streaks
    @Autowired
    private UserDailyChallengeRepo userDailyChallengeRepository;

    // Repository for selecting random Pokemon for challenges
    @Autowired
    private PokemonRepo pokemonRepository;

    // Repository for fetching user data when claiming challenges
    @Autowired
    private UserRepo userRepository;

    // Get today's challenge - creates a new one if it doesn't exist yet
    @Transactional
    public DailyChallengeDTO getTodayChallenge() {
        try {
            // Get today's date for challenge lookup
            LocalDate today = LocalDate.now();

            // Check if a challenge already exists for today's date
            Optional<DailyChallenge> existingChallenge = dailyChallengeRepository.findByChallengeDate(today);

            DailyChallenge challenge;
            if (existingChallenge.isEmpty()) {
                // No challenge exists for today - create a new one
                challenge = createDailyChallenge();
            } else {
                // Challenge already exists - use the existing one
                challenge = existingChallenge.get();
            }

            // Convert entity to DTO for safe data transfer to frontend
            DailyChallengeDTO dto = new DailyChallengeDTO();
            dto.setPokemonId(challenge.getPokemon().getId());
            dto.setPokemonName(challenge.getPokemon().getName());
            dto.setSpriteUrl(challenge.getPokemon().getSpriteUrl());
            dto.setDescription(
                    "Catch " + challenge.getPokemon().getName() + " today to earn points and maintain your streak!");
            dto.setCatchTip(getCatchTip(challenge.getPokemon()));
            dto.setPointsReward(100); // Fixed reward for completing daily challenge

            return dto;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get daily challenge: " + e.getMessage());
        }
    }

    // Create a new daily challenge with a random Pokemon
    private DailyChallenge createDailyChallenge() {
        // Get all Pokemon from database
        List<Pokemon> allPokemon = pokemonRepository.findAll();
        if (allPokemon.isEmpty()) {
            throw new PokemonNotFoundException("No Pokemon available for challenge");
        }

        // Select a random Pokemon from the complete list
        Random random = new Random();
        Pokemon randomPokemon = allPokemon.get(random.nextInt(allPokemon.size()));

        // Create and configure new daily challenge
        DailyChallenge challenge = new DailyChallenge();
        challenge.setChallengeDate(LocalDate.now());
        challenge.setPokemon(randomPokemon);
        challenge.setActive(true);

        // Save to database and return
        return dailyChallengeRepository.save(challenge);
    }

    // Claim challenge reward for a user
    @Transactional
    public String claimChallenge(String username) {
        try {
            // Find user by username
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            // Get today's challenge
            DailyChallenge todayChallenge = dailyChallengeRepository.findByChallengeDate(LocalDate.now())
                    .orElseThrow(() -> new RuntimeException("No challenge available today"));

            // Check if user already claimed today's challenge
            Optional<UserDailyChallenge> existing = userDailyChallengeRepository
                    .findByUserAndDailyChallenge(user, todayChallenge);

            if (existing.isPresent() && existing.get().isCompleted()) {
                return "You already claimed today's challenge! Come back tomorrow!";
            }

            // Check if user has caught today's Pokemon
            boolean hasCaught = user.getPokemons().stream()
                    .anyMatch(p -> p.getId().equals(todayChallenge.getPokemon().getId()));

            if (!hasCaught) {
                return "You haven't caught " + todayChallenge.getPokemon().getName() + " yet! Go catch it first!";
            }

            // Calculate current streak (consecutive days of completing challenges)
            int streak = calculateStreak(user);

            // Create or update user challenge record
            UserDailyChallenge userChallenge;
            if (existing.isPresent()) {
                userChallenge = existing.get();
            } else {
                userChallenge = new UserDailyChallenge();
                userChallenge.setUser(user);
                userChallenge.setDailyChallenge(todayChallenge);
            }

            // Mark challenge as completed and record completion date
            userChallenge.setCompleted(true);
            userChallenge.setCompletionDate(LocalDate.now());
            userChallenge.setStreakCount(streak);

            // Save to database
            userDailyChallengeRepository.save(userChallenge);

            return "Congratulations! You caught " + todayChallenge.getPokemon().getName() +
                    " and earned 100 points! Current streak: " + streak + " days!";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to claim challenge: " + e.getMessage());
        }
    }

    // Get user's current challenge streak
    public int getUserStreak(String username) {
        try {
            // Find user by username
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            // Calculate and return streak
            return calculateStreak(user);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    // Calculate streak based on consecutive challenge completions
    private int calculateStreak(User user) {
        // Get all challenge completions for user, sorted by date descending (newest
        // first)
        List<UserDailyChallenge> completions = userDailyChallengeRepository
                .findByUserOrderByCompletionDateDesc(user);

        // No completions means streak is zero
        if (completions.isEmpty()) {
            return 0;
        }

        // Calculate streak by checking consecutive days
        int streak = 0;
        LocalDate expectedDate = LocalDate.now();

        for (UserDailyChallenge completion : completions) {
            if (completion.getCompletionDate() != null && completion.getCompletionDate().equals(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1); // Move to previous day for next check
            } else {
                break; // Break streak if a day is missing
            }
        }

        return streak;
    }

    // Get catch tip based on Pokemon type and rarity
    private String getCatchTip(Pokemon pokemon) {
        String tip = "Tip: ";

        // Add type-specific hunting advice
        if (pokemon.getTypes().stream().anyMatch(t -> t.getName().equals("Water"))) {
            tip += "Use a Fishing Rod or Surf near water areas. ";
        } else if (pokemon.getTypes().stream().anyMatch(t -> t.getName().equals("Fire"))) {
            tip += "Found in caves and volcanic areas. ";
        } else if (pokemon.getTypes().stream().anyMatch(t -> t.getName().equals("Grass"))) {
            tip += "Look in forests and grassy fields. ";
        } else if (pokemon.getTypes().stream().anyMatch(t -> t.getName().equals("Electric"))) {
            tip += "Often found near power plants or in caves. ";
        }

        // Add rarity-specific catch advice
        if (pokemon.getRarity().equals("Legendary")) {
            tip += "Very rare! Use Ultra Balls for better catch rate!";
        } else if (pokemon.getRarity().equals("Rare")) {
            tip += "Great Ball recommended for this Pokemon.";
        } else {
            tip += "Can be caught with a standard Poke Ball.";
        }

        return tip;
    }
}