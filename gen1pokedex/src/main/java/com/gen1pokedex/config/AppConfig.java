package com.gen1pokedex.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

// Configuration bean for data seeding properties such as enable flag and PokeAPI source URL
@Configuration
@ConfigurationProperties(prefix = "app.seed")
public class AppConfig {
    // Enable or disable automatic data seeding
    private boolean enabled = true;

    // Source URL for PokeAPI data import
    private String source = "https://pokeapi.co/api/v2/pokemon?limit=151";

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}