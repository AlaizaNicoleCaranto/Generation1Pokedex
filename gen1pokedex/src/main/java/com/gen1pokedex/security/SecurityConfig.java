package com.gen1pokedex.security;

import org.springframework.beans.factory.annotation.Autowired; // inject JWT filter bean
import org.springframework.context.annotation.Bean; // define Spring beans
import org.springframework.context.annotation.Configuration; // configuration class marker
import org.springframework.security.authentication.AuthenticationManager; // manages authentication flow
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // provides authentication manager
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // configures web security
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // enables web security for the app
import org.springframework.security.config.http.SessionCreationPolicy; // configures session policy for JWT use
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // password encoding for secure storage
import org.springframework.security.web.SecurityFilterChain; // defines the Spring Security filter chain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // authentication filter type
import org.springframework.web.cors.CorsConfiguration; // CORS configuration settings
import org.springframework.web.cors.CorsConfigurationSource; // source of CORS config
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // URL-based CORS mapping
import java.util.List; // list type for allowed origins and methods

// Security configuration defining public and protected routes, JWT filters, and authentication behavior
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // JWT filter validates incoming requests and extracts user identity
    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    // Bean to hash user passwords before saving to database
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean that exposes AuthenticationManager for login flow
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Configure security rules, public access, and admin restrictions
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // Disable CSRF because this API uses stateless JWTs
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints without authentication
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/users/register").permitAll()
                        .requestMatchers("/api/pokemons/**").permitAll()
                        .requestMatchers("/api/daily-challenge/**").permitAll()

                        // Admin-only endpoints require ADMIN role
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // All other endpoints require a valid authenticated user
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless session management for JWT
                );

        // Add JWT request filter before Spring Security authentication filter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Allow requests from the React frontend
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}