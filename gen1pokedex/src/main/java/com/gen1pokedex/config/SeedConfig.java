package com.gen1pokedex.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration // mark as config class
@ConfigurationProperties(prefix = "app.seed") // matches app.seed.*
public class SeedConfig {

    private boolean enabled; // app.seed.enabled
    private String source; // app.seed.source

    // getter
    public boolean isEnabled() {
        return enabled;
    }

    // setter
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    // getter
    public String getSource() {
        return source;
    }

    // setter
    public void setSource(String source) {
        this.source = source;
    }
}