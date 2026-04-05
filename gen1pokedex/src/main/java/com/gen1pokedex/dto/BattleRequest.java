package com.gen1pokedex.dto;

public class BattleRequest {
    private Long pokemon1Id; // first Pokémon ID for battle simulation
    private Long pokemon2Id; // second Pokémon ID for battle simulation

    public Long getPokemon1Id() {
        return pokemon1Id;
    }

    public void setPokemon1Id(Long pokemon1Id) {
        this.pokemon1Id = pokemon1Id;
    }

    public Long getPokemon2Id() {
        return pokemon2Id;
    }

    public void setPokemon2Id(Long pokemon2Id) {
        this.pokemon2Id = pokemon2Id;
    }
}