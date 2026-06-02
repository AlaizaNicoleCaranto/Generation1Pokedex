package com.gen1pokedex.dto;

import com.gen1pokedex.entity.Badge;
import java.util.List;

public class UserProfileDTO {
    private String username; // unique trainer username
    private String role; // user role, e.g. USER or ADMIN
    private String email; // trainer email address
    private String bio; // short trainer biography
    private int pokemonCount; // number of Pokémon caught by the user
    private int favoriteCount; // number of favorite Pokémon
    private double completionPercentage; // Pokédex completion percentage
    private String avatarUrl; // avatar image URL or data URI
    private List<Badge> badges; // earned achievement badges
    private String status; // account status: ACTIVE, BANNED, or SUSPENDED

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public int getPokemonCount() {
        return pokemonCount;
    }

    public void setPokemonCount(int pokemonCount) {
        this.pokemonCount = pokemonCount;
    }

    public int getFavoriteCount() {
        return favoriteCount;
    }

    public void setFavoriteCount(int favoriteCount) {
        this.favoriteCount = favoriteCount;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public List<Badge> getBadges() {
        return badges;
    }

    public void setBadges(List<Badge> badges) {
        this.badges = badges;
    }

    public String getStatus() {
        return status; // retrieve account status
    }

    public void setStatus(String status) {
        this.status = status; // set account status for admin visibility
    }
}