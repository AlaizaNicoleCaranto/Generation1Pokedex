package com.gen1pokedex.dto;

public class DailyChallengeDTO {
    private Long pokemonId; // featured Pokémon ID for today's challenge
    private String pokemonName; // featured Pokémon name
    private String spriteUrl; // display sprite URL for the challenge
    private String description; // challenge description text
    private String catchTip; // tip to catch this Pokémon
    private int pointsReward; // reward points for completion

    // Getters and setters
    public Long getPokemonId() {
        return pokemonId;
    }

    public void setPokemonId(Long pokemonId) {
        this.pokemonId = pokemonId;
    }

    public String getPokemonName() {
        return pokemonName;
    }

    public void setPokemonName(String pokemonName) {
        this.pokemonName = pokemonName;
    }

    public String getSpriteUrl() {
        return spriteUrl;
    }

    public void setSpriteUrl(String spriteUrl) {
        this.spriteUrl = spriteUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCatchTip() {
        return catchTip;
    }

    public void setCatchTip(String catchTip) {
        this.catchTip = catchTip;
    }

    public int getPointsReward() {
        return pointsReward;
    }

    public void setPointsReward(int pointsReward) {
        this.pointsReward = pointsReward;
    }
}