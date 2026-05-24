package com.gen1pokedex.service;

// Import BattleResult DTO for returning battle outcomes
import com.gen1pokedex.dto.BattleResult;

// Import Pokemon entity for accessing Pokemon data
import com.gen1pokedex.entity.Pokemon;
import com.gen1pokedex.entity.PokemonLevel;
import com.gen1pokedex.entity.Type;

// Import custom exception for when Pokemon is not found
import com.gen1pokedex.exception.PokemonNotFoundException;

// Import Pokemon repository for database access
import com.gen1pokedex.repository.PokemonRepo;
import com.gen1pokedex.repository.PokemonLevelRepo;

// Import Spring annotations for dependency injection
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Import HashMap and Map for storing type effectiveness chart
import java.util.HashMap;
import java.util.Map;

// Import Random for adding randomness to damage calculations
import java.util.Random;

// Import Security for getting current logged in user
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

// Service class that handles Pokemon battle simulation logic
@Service
public class BattleService {

    // Repository for accessing Pokemon data from database
    @Autowired
    private PokemonRepo pokemonRepository;

    // Repository for tracking Pokemon levels and XP
    @Autowired
    private PokemonLevelRepo pokemonLevelRepository;

    // Type effectiveness chart for Gen 1 Pokemon
    // Maps attacker type -> defender type -> damage multiplier
    // 2.0 = super effective (double damage)
    // 0.5 = not very effective (half damage)
    // 0.0 = no effect (immune)
    private static final Map<String, Map<String, Double>> TYPE_EFFECTIVENESS = new HashMap<>();

    // Static initializer block - runs once when class loads
    // Sets up all type effectiveness relationships
    static {
        // NORMAL type effectiveness
        Map<String, Double> normal = new HashMap<>();
        normal.put("Rock", 0.5); // Rock resists Normal
        normal.put("Ghost", 0.0); // Ghost is immune to Normal
        normal.put("Steel", 0.5); // Steel resists Normal
        TYPE_EFFECTIVENESS.put("Normal", normal);

        // FIRE type effectiveness
        Map<String, Double> fire = new HashMap<>();
        fire.put("Fire", 0.5); // Fire resists Fire
        fire.put("Water", 0.5); // Water resists Fire
        fire.put("Grass", 2.0); // Fire is super effective against Grass
        fire.put("Ice", 2.0); // Fire is super effective against Ice
        fire.put("Bug", 2.0); // Fire is super effective against Bug
        fire.put("Rock", 0.5); // Rock resists Fire
        fire.put("Dragon", 0.5); // Dragon resists Fire
        fire.put("Steel", 2.0); // Fire is super effective against Steel
        TYPE_EFFECTIVENESS.put("Fire", fire);

        // WATER type effectiveness
        Map<String, Double> water = new HashMap<>();
        water.put("Fire", 2.0); // Water is super effective against Fire
        water.put("Water", 0.5); // Water resists Water
        water.put("Grass", 0.5); // Grass resists Water
        water.put("Ground", 2.0); // Water is super effective against Ground
        water.put("Rock", 2.0); // Water is super effective against Rock
        water.put("Dragon", 0.5); // Dragon resists Water
        TYPE_EFFECTIVENESS.put("Water", water);

        // GRASS type effectiveness
        Map<String, Double> grass = new HashMap<>();
        grass.put("Fire", 0.5); // Fire resists Grass
        grass.put("Water", 2.0); // Grass is super effective against Water
        grass.put("Grass", 0.5); // Grass resists Grass
        grass.put("Poison", 0.5); // Poison resists Grass
        grass.put("Ground", 2.0); // Grass is super effective against Ground
        grass.put("Flying", 0.5); // Flying resists Grass
        grass.put("Bug", 0.5); // Bug resists Grass
        grass.put("Rock", 2.0); // Grass is super effective against Rock
        grass.put("Dragon", 0.5); // Dragon resists Grass
        grass.put("Steel", 0.5); // Steel resists Grass
        TYPE_EFFECTIVENESS.put("Grass", grass);
    }

    // Main battle simulation method - determines winner between two Pokemon
    public BattleResult simulateBattle(Long pokemon1Id, Long pokemon2Id) {
        // Fetch first Pokemon from database by ID, throw exception if not found
        Pokemon pokemon1 = pokemonRepository.findById(pokemon1Id)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemon1Id));

        // Fetch second Pokemon from database by ID, throw exception if not found
        Pokemon pokemon2 = pokemonRepository.findById(pokemon2Id)
                .orElseThrow(() -> new PokemonNotFoundException("Pokemon not found: " + pokemon2Id));

        // Calculate combined attack stat (attack + half of special attack)
        int p1Attack = calculateAttackStat(pokemon1);
        int p2Attack = calculateAttackStat(pokemon2);

        // Calculate combined defense stat (defense + half of special defense)
        int p1Defense = calculateDefenseStat(pokemon1);
        int p2Defense = calculateDefenseStat(pokemon2);

        // Calculate type effectiveness multipliers for both matchups
        double p1VsP2 = getTypeEffectiveness(pokemon1, pokemon2);
        double p2VsP1 = getTypeEffectiveness(pokemon2, pokemon1);

        // Create StringBuilder to store battle log messages
        StringBuilder battleLog = new StringBuilder();
        battleLog.append("BATTLE START: ").append(pokemon1.getName()).append(" vs ").append(pokemon2.getName())
                .append("\n");

        // Get initial HP values for both Pokemon
        int p1Hp = pokemon1.getHp();
        int p2Hp = pokemon2.getHp();

        // Track current turn number for battle log
        int turn = 1;

        // Create Random instance for damage variation
        Random random = new Random();

        // Battle loop continues until one Pokemon's HP reaches zero
        while (p1Hp > 0 && p2Hp > 0) {
            battleLog.append("\nTurn ").append(turn).append(":\n");

            // Determine attack order based on Speed stat
            // Higher speed attacks first
            boolean p1AttacksFirst = pokemon1.getSpeed() >= pokemon2.getSpeed();

            if (p1AttacksFirst) {
                // Pokemon 1 attacks first
                int damage = calculateDamage(p1Attack, p2Defense, p1VsP2, random);
                p2Hp -= damage;
                battleLog.append("  ").append(pokemon1.getName()).append(" attacks! Deals ").append(damage)
                        .append(" damage!\n");

                // Check if Pokemon 2 fainted from the attack
                if (p2Hp <= 0)
                    break;

                // Pokemon 2 counterattacks (if still alive)
                damage = calculateDamage(p2Attack, p1Defense, p2VsP1, random);
                p1Hp -= damage;
                battleLog.append("  ").append(pokemon2.getName()).append(" counterattacks! Deals ").append(damage)
                        .append(" damage!\n");
            } else {
                // Pokemon 2 attacks first (faster Pokemon)
                int damage = calculateDamage(p2Attack, p1Defense, p2VsP1, random);
                p1Hp -= damage;
                battleLog.append("  ").append(pokemon2.getName()).append(" attacks! Deals ").append(damage)
                        .append(" damage!\n");

                // Check if Pokemon 1 fainted from the attack
                if (p1Hp <= 0)
                    break;

                // Pokemon 1 counterattacks (if still alive)
                damage = calculateDamage(p1Attack, p2Defense, p1VsP2, random);
                p2Hp -= damage;
                battleLog.append("  ").append(pokemon1.getName()).append(" counterattacks! Deals ").append(damage)
                        .append(" damage!\n");
            }

            // Increment turn counter for next round
            turn++;
        }

        // Determine winner based on which Pokemon still has HP remaining
        boolean pokemon1Wins = p2Hp <= 0;
        String winner = pokemon1Wins ? pokemon1.getName() : pokemon2.getName();
        String winnerSprite = pokemon1Wins ? pokemon1.getSpriteUrl() : pokemon2.getSpriteUrl();
        String loser = pokemon1Wins ? pokemon2.getName() : pokemon1.getName();
        String loserSprite = pokemon1Wins ? pokemon2.getSpriteUrl() : pokemon1.getSpriteUrl();
        int winnerHpRemaining = pokemon1Wins ? p1Hp : p2Hp;
        Long winnerId = pokemon1Wins ? pokemon1.getId() : pokemon2.getId();

        // Add winner announcement to battle log
        battleLog.append("\nWINNER: ").append(winner).append(" with ").append(winnerHpRemaining)
                .append(" HP remaining!");

        // ========== NEW: ADD XP REWARD FOR WINNER ==========
        int xpGained = 0;
        int newLevel = 0;

        try {
            // Get current logged in username
            String username = getCurrentUsername();

            if (username != null) {
                // Find the winner's level data
                PokemonLevel winnerLevel = pokemonLevelRepository
                        .findByUsernameAndPokemonId(username, winnerId)
                        .orElse(null);

                if (winnerLevel != null) {
                    // Base XP: 20 XP per battle win
                    xpGained = 20;
                    int oldLevel = winnerLevel.getLevel();
                    int newExp = winnerLevel.getExperience() + xpGained;
                    newLevel = oldLevel;

                    // Level up logic: 100 XP = 1 level
                    while (newExp >= 100) {
                        newExp -= 100;
                        newLevel++;
                    }

                    // Save the updated level data
                    winnerLevel.setExperience(newExp);
                    winnerLevel.setLevel(newLevel);
                    winnerLevel.setLastUpdated(java.time.LocalDateTime.now());
                    pokemonLevelRepository.save(winnerLevel);

                    // Add XP gain message to battle log
                    battleLog.append("\n\n✨ ").append(winner).append(" gained ").append(xpGained)
                            .append(" XP");
                    if (newLevel > oldLevel) {
                        battleLog.append(" and LEVELED UP to Level ").append(newLevel).append("! ✨");
                    } else {
                        battleLog.append("! (" + newExp + "/100 XP to next level)");
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Failed to award XP: " + e.getMessage());
        }

        // Return BattleResult object with all battle information
        return new BattleResult(winner, winnerSprite, loser, loserSprite,
                battleLog.toString(), winnerHpRemaining, xpGained, newLevel);
    }

    // Calculate combined attack stat for damage calculation
    // Uses Attack stat plus half of Special Attack for Gen1 style
    private int calculateAttackStat(Pokemon pokemon) {
        return pokemon.getAttack() + (pokemon.getSpecialAttack() / 2);
    }

    // Calculate combined defense stat for damage reduction
    // Uses Defense stat plus half of Special Defense for Gen1 style
    private int calculateDefenseStat(Pokemon pokemon) {
        return pokemon.getDefense() + (pokemon.getSpecialDefense() / 2);
    }

    // Calculate type effectiveness multiplier between attacker and defender
    // Multiplies effectiveness for each type combination
    private double getTypeEffectiveness(Pokemon attacker, Pokemon defender) {
        double multiplier = 1.0;

        // Loop through all attacker's types and defender's types
        for (Type attackerType : attacker.getTypes()) {
            for (Type defenderType : defender.getTypes()) {
                // Look up effectiveness from the type chart
                Map<String, Double> effectiveness = TYPE_EFFECTIVENESS.get(attackerType.getName());
                if (effectiveness != null && effectiveness.containsKey(defenderType.getName())) {
                    multiplier *= effectiveness.get(defenderType.getName());
                }
            }
        }

        return multiplier;
    }

    // Calculate damage with randomness for varied battle outcomes
    private int calculateDamage(int attack, int defense, double effectiveness, Random random) {
        // Random factor between 0.85 and 1.0 (85% to 100% of calculated damage)
        double randomFactor = 0.85 + (random.nextDouble() * 0.15);

        // Damage formula: (attack * 1.5) / (defense / 10) * effectiveness *
        // randomFactor
        int damage = (int) (((attack * 1.5) / (defense / 10.0)) * effectiveness * randomFactor);

        // Minimum damage is always 1 (every attack does at least 1 damage)
        return Math.max(1, damage);
    }

    // Helper method to get current logged in username
    private String getCurrentUsername() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                return ((UserDetails) principal).getUsername();
            } else {
                return principal.toString();
            }
        } catch (Exception e) {
            return null;
        }
    }
}