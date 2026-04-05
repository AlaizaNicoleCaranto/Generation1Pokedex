package com.gen1pokedex.seeder;

// Import configuration classes for seeding settings
import com.gen1pokedex.config.AppConfig;

// Import entity classes for database models
import com.gen1pokedex.entity.Ability;
import com.gen1pokedex.entity.Badge;
import com.gen1pokedex.entity.Pokemon;
import com.gen1pokedex.entity.Type;
import com.gen1pokedex.entity.User;

// Import repository interfaces for database operations
import com.gen1pokedex.repository.AbilityRepo;
import com.gen1pokedex.repository.BadgeRepo;
import com.gen1pokedex.repository.PokemonRepo;
import com.gen1pokedex.repository.TypeRepo;
import com.gen1pokedex.repository.UserRepo;

// Import JSON parsing utilities
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

// Import Spring framework annotations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// Import Java utilities
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

// Service that seeds database with initial data on application startup
@Service
public class DataSeeder implements CommandLineRunner {

    // Repository for Pokemon data - seeded from PokeAPI
    @Autowired
    private PokemonRepo pokemonRepository;

    // Repository for Pokemon type metadata
    @Autowired
    private TypeRepo typeRepository;

    // Repository for ability data
    @Autowired
    private AbilityRepo abilityRepository;

    // Repository for badge metadata
    @Autowired
    private BadgeRepo badgeRepository;

    // Repository for creating default admin user
    @Autowired
    private UserRepo userRepository;

    // Configuration values that control seeding behavior
    @Autowired
    private AppConfig appConfig;

    // REST client for making HTTP requests to PokeAPI
    private final RestTemplate restTemplate = new RestTemplate();

    // JSON parser for converting API responses
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Main seeding method - runs automatically when Spring Boot starts
    @Override
    public void run(String... args) throws Exception {
        // Check if seeding is enabled in configuration
        if (!appConfig.isEnabled()) {
            System.out.println("Data seeding is disabled");
            return;
        }

        // Check if database already has Pokemon (prevents duplicate seeding)
        if (pokemonRepository.count() > 0) {
            System.out
                    .println("Database already contains " + pokemonRepository.count() + " Pokemon. Skipping seeding.");
            createDefaultAdmin();
            return;
        }

        System.out.println("Starting Gen 1 Pokedex data seeding...");

        // Seed all required data in correct order (dependencies first)
        seedTypes(); // Types must come first (Pokemon need types)
        seedAbilities(); // Abilities must come second (Pokemon need abilities)
        seedPokemon(); // Pokemon third (depends on types and abilities)
        seedEvolutionChains(); // Evolution chains fourth (depends on Pokemon)
        seedBadges(); // Badges fifth (standalone)
        createDefaultAdmin(); // Admin user last

        System.out.println("Data seeding completed successfully!");
        System.out.println("Gen 1 Pokedex Backend is running!");
    }

    // Seed all Pokemon types from Gen 1
    private void seedTypes() {
        System.out.println("Seeding Pokemon types...");

        // Array of all 15 Gen 1 Pokemon types
        String[] types = {
                "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting",
                "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon"
        };

        // Array of matching colors for frontend display
        String[] colors = {
                "#A8A878", "#F08030", "#6890F0", "#78C850", "#F8D030", "#98D8D8", "#C03028",
                "#A040A0", "#E0C068", "#A890F0", "#F85888", "#A8B820", "#B8A038", "#705898", "#7038F8"
        };

        // Create and save each type
        for (int i = 0; i < types.length; i++) {
            Type type = new Type();
            type.setName(types[i]);
            type.setColor(colors[i]);
            typeRepository.save(type);
        }

        System.out.println("Seeded " + types.length + " types");
    }

    // Seed Pokemon abilities from Gen 1
    private void seedAbilities() {
        System.out.println("Seeding Pokemon abilities...");

        // Array of common Gen 1 abilities
        String[] abilities = {
                "Overgrow", "Blaze", "Torrent", "Shield Dust", "Shed Skin", "Compound Eyes",
                "Swarm", "Guts", "Intimidate", "Static", "Volt Absorb", "Water Absorb",
                "Oblivious", "Cloud Nine", "Run Away", "Keen Eye", "Flash Fire", "Flame Body"
        };

        // Create and save each ability
        for (String abilityName : abilities) {
            Ability ability = new Ability();
            ability.setName(abilityName);
            abilityRepository.save(ability);
        }

        System.out.println("Seeded " + abilities.length + " abilities");
    }

    // Seed all 151 Gen 1 Pokemon from PokeAPI
    private void seedPokemon() throws Exception {
        System.out.println("Seeding 151 Gen 1 Pokemon from PokeAPI...");

        // Fetch list of all Gen 1 Pokemon from configured URL
        String url = appConfig.getSource();
        String response = restTemplate.getForObject(url, String.class);
        JsonNode root = objectMapper.readTree(response);
        JsonNode results = root.get("results");

        int count = 0;
        // Process each Pokemon in the list
        for (JsonNode result : results) {
            // Fetch detailed data for each Pokemon
            String pokemonUrl = result.get("url").asText();
            String pokemonData = restTemplate.getForObject(pokemonUrl, String.class);
            JsonNode pokemonNode = objectMapper.readTree(pokemonData);

            Pokemon pokemon = new Pokemon();

            // Set basic Pokemon information
            int number = pokemonNode.get("id").asInt();
            pokemon.setPokedexNumber(number);
            pokemon.setName(capitalize(pokemonNode.get("name").asText()));
            pokemon.setHeight(pokemonNode.get("height").asInt() / 10.0);
            pokemon.setWeight(pokemonNode.get("weight").asInt() / 10.0);

            // Set sprite URL for frontend display
            JsonNode sprites = pokemonNode.get("sprites");
            String spriteUrl = sprites.get("front_default").asText();
            pokemon.setSpriteUrl(spriteUrl);

            // Parse and set Pokemon stats (HP, Attack, Defense, Speed, Special Attack,
            // Special Defense)
            JsonNode stats = pokemonNode.get("stats");
            for (JsonNode stat : stats) {
                String statName = stat.get("stat").get("name").asText();
                int baseStat = stat.get("base_stat").asInt();

                switch (statName) {
                    case "hp":
                        pokemon.setHp(baseStat);
                        break;
                    case "attack":
                        pokemon.setAttack(baseStat);
                        break;
                    case "defense":
                        pokemon.setDefense(baseStat);
                        break;
                    case "speed":
                        pokemon.setSpeed(baseStat);
                        break;
                    case "special-attack":
                        pokemon.setSpecialAttack(baseStat);
                        break;
                    case "special-defense":
                        pokemon.setSpecialDefense(baseStat);
                        break;
                }
            }

            // Parse and set Pokemon types (can be 1 or 2 types)
            JsonNode types = pokemonNode.get("types");
            Set<Type> pokemonTypes = new HashSet<>();
            for (JsonNode typeNode : types) {
                String typeName = capitalize(typeNode.get("type").get("name").asText());
                Type type = typeRepository.findByNameIgnoreCase(typeName).orElse(null);
                if (type != null) {
                    pokemonTypes.add(type);
                }
            }
            pokemon.setTypes(pokemonTypes);

            // Parse and set Pokemon abilities
            JsonNode abilities = pokemonNode.get("abilities");
            Set<Ability> pokemonAbilities = new HashSet<>();
            for (JsonNode abilityNode : abilities) {
                String abilityName = capitalize(abilityNode.get("ability").get("name").asText());
                Ability ability = abilityRepository.findByNameIgnoreCase(abilityName).orElse(null);
                if (ability != null) {
                    pokemonAbilities.add(ability);
                }
            }
            pokemon.setAbilities(pokemonAbilities);

            // Set Gen 1 specific metadata
            pokemon.setRegion("Kanto");
            pokemon.setRarity(determineRarity(number));
            pokemon.setHabitat(determineHabitat(pokemon.getName(), pokemon.getTypes()));
            pokemon.setDescription(generateDescription(pokemon.getName(), pokemon.getTypes()));

            // Save Pokemon to database
            pokemonRepository.save(pokemon);
            count++;

            // Progress indicator every 20 Pokemon
            if (count % 20 == 0) {
                System.out.println("Seeded " + count + " Pokemon...");
            }
        }

        System.out.println("Seeded " + count + " Pokemon successfully!");
    }

    // Seed evolution chains from PokeAPI
    private void seedEvolutionChains() throws Exception {
        System.out.println("Seeding evolution chains...");

        // Fetch evolution chains from PokeAPI (limit 50 chains)
        String url = "https://pokeapi.co/api/v2/evolution-chain?limit=50";
        String response = restTemplate.getForObject(url, String.class);
        JsonNode root = objectMapper.readTree(response);
        JsonNode results = root.get("results");

        // Process each evolution chain
        for (JsonNode result : results) {
            String chainUrl = result.get("url").asText();
            String chainData = restTemplate.getForObject(chainUrl, String.class);
            JsonNode chainNode = objectMapper.readTree(chainData);
            JsonNode chain = chainNode.get("chain");

            // Recursively process the evolution chain
            processEvolutionChain(chain, null);
        }

        System.out.println("Evolution chains seeded!");
    }

    // Recursively process evolution chain and link Pokemon
    private void processEvolutionChain(JsonNode chain, Pokemon evolvesFrom) {
        try {
            // Get species URL for current Pokemon in chain
            String speciesUrl = chain.get("species").get("url").asText();
            String speciesData = restTemplate.getForObject(speciesUrl, String.class);
            JsonNode speciesNode = objectMapper.readTree(speciesData);
            String pokemonName = speciesNode.get("name").asText();

            // Find Pokemon in database by name
            Optional<Pokemon> pokemonOpt = pokemonRepository.findByNameIgnoreCase(pokemonName);
            if (pokemonOpt.isPresent()) {
                Pokemon pokemon = pokemonOpt.get();
                // Link evolution from previous stage if it exists
                if (evolvesFrom != null) {
                    pokemon.setEvolvesFrom(evolvesFrom);
                    pokemonRepository.save(pokemon);
                }

                // Process next evolution stages recursively
                JsonNode evolvesTo = chain.get("evolves_to");
                if (evolvesTo != null && evolvesTo.size() > 0) {
                    for (JsonNode evolution : evolvesTo) {
                        processEvolutionChain(evolution, pokemon);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error processing evolution chain: " + e.getMessage());
        }
    }

    // Seed achievement badges for gamification
    private void seedBadges() {
        System.out.println("Seeding achievement badges...");

        List<Badge> badges = new ArrayList<>();

        // Create badge definitions with text-based icons instead of emoji
        badges.add(createBadge("CATCH_10", "Novice Catcher", "Catch 10 different Pokemon", "[Medal]", 10, "CATCH"));
        badges.add(createBadge("CATCH_50", "Skilled Catcher", "Catch 50 different Pokemon", "[Star]", 50, "CATCH"));
        badges.add(createBadge("CATCH_100", "Expert Catcher", "Catch 100 different Pokemon", "[Trophy]", 100, "CATCH"));
        badges.add(createBadge("CATCH_151", "Master Catcher", "Catch all 151 Pokemon!", "[Crown]", 151, "CATCH"));
        badges.add(createBadge("COMPLETE_HALF", "Halfway There", "Complete 50 percent of the Pokedex", "[Star]", 1,
                "COMPLETION"));
        badges.add(createBadge("COMPLETE_MASTER", "Pokedex Master", "Complete 100 percent of the Pokedex", "[Master]",
                1, "COMPLETION"));
        badges.add(createBadge("STREAK_7", "Weekly Warrior", "Maintain a 7-day catch streak", "[Flame]", 7, "STREAK"));
        badges.add(createBadge("STREAK_30", "Monthly Master", "Maintain a 30-day catch streak", "[Diamond]", 30,
                "STREAK"));

        // Save only badges that don't already exist
        for (Badge badge : badges) {
            if (badgeRepository.findByCode(badge.getCode()).isEmpty()) {
                badgeRepository.save(badge);
            }
        }

        System.out.println("Seeded " + badges.size() + " badges");
    }

    // Helper method to create a new badge object
    private Badge createBadge(String code, String name, String description, String icon, int required,
            String criteria) {
        Badge badge = new Badge();
        badge.setCode(code);
        badge.setName(name);
        badge.setDescription(description);
        badge.setIconUrl(icon);
        badge.setRequiredCount(required);
        badge.setCriteria(criteria);
        return badge;
    }

    // Create default admin user for system management
    private void createDefaultAdmin() {
        System.out.println("Creating default admin user...");

        // Check if admin user already exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            // Encode password using BCrypt for security
            admin.setPassword(new BCryptPasswordEncoder().encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Admin user created: username=admin, password=admin123");
        } else {
            System.out.println("Admin user already exists");
        }
    }

    // Determine Pokemon rarity based on Pokedex number
    private String determineRarity(int pokedexNumber) {
        // Legendary Pokemon in Gen 1: Articuno(144), Zapdos(145), Moltres(146),
        // Mewtwo(150), Mew(151)
        int[] legendaries = { 144, 145, 146, 150, 151 };

        // Check if Pokemon is legendary
        if (Arrays.stream(legendaries).anyMatch(n -> n == pokedexNumber)) {
            return "Legendary";
        } else {
            // Every 10th Pokemon is considered rare
            if (pokedexNumber % 10 == 0) {
                return "Rare";
            } else {
                return "Common";
            }
        }
    }

    // Determine Pokemon habitat based on types
    private String determineHabitat(String name, Set<Type> types) {
        if (types.stream().anyMatch(t -> t.getName().equals("Water"))) {
            return "Water's Edge";
        } else if (types.stream().anyMatch(t -> t.getName().equals("Fire"))) {
            return "Mountain";
        } else if (types.stream().anyMatch(t -> t.getName().equals("Grass"))) {
            return "Forest";
        } else if (types.stream().anyMatch(t -> t.getName().equals("Rock") || t.getName().equals("Ground"))) {
            return "Cave";
        } else if (types.stream().anyMatch(t -> t.getName().equals("Flying"))) {
            return "Sky";
        } else {
            return "Grassland";
        }
    }

    // Generate a simple description for each Pokemon
    private String generateDescription(String name, Set<Type> types) {
        String typeStr = types.stream()
                .map(Type::getName)
                .reduce((a, b) -> a + "/" + b)
                .orElse("Unknown");
        return name + " is a " + typeStr + "-type Pokemon. It is known for its unique abilities and characteristics.";
    }

    // Capitalize first letter of a string, convert rest to lowercase
    // This ensures consistent name formatting for Pokemon names and types
    private String capitalize(String str) {
        // Check if the input string is null or empty
        if (str == null || str.isEmpty()) {
            // Return the original string if it is null or empty
            return str;
        }
        // Capitalize the first character and convert the remaining characters to
        // lowercase
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}