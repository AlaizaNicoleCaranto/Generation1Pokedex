package com.gen1pokedex.dto;

import com.gen1pokedex.entity.Ability;
import com.gen1pokedex.entity.Type;
import java.util.Set;

// Data Transfer Object for Pokemon - controls what data is sent to frontend
public class PokemonDTO {
    private Long id; // database identifier for this Pokémon record
    private int pokedexNumber; // Gen 1 Pokédex number
    private String name; // Pokémon name
    private double height; // physical height value
    private double weight; // physical weight value
    private String description; // flavor text description
    private String habitat; // natural habitat of the Pokémon
    private String region; // region where this Pokémon is found
    private String rarity; // rarity tier like Common, Rare, Legendary
    private String spriteUrl; // URL to the Pokémon sprite image
    private int hp; // health points stat
    private int attack; // attack stat
    private int defense; // defense stat
    private int speed; // speed stat
    private int specialAttack; // special attack stat
    private int specialDefense; // special defense stat
    private Set<Type> types; // Pokémon type(s)
    private Set<Ability> abilities; // Pokémon abilities
    private PokemonDTO evolvesFrom; // evolution predecessor chain
    private double completionPercentage; // completion progress for this Pokémon in the user's Pokédex

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getPokedexNumber() {
        return pokedexNumber;
    }

    public void setPokedexNumber(int pokedexNumber) {
        this.pokedexNumber = pokedexNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHabitat() {
        return habitat;
    }

    public void setHabitat(String habitat) {
        this.habitat = habitat;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getRarity() {
        return rarity;
    }

    public void setRarity(String rarity) {
        this.rarity = rarity;
    }

    public String getSpriteUrl() {
        return spriteUrl;
    }

    public void setSpriteUrl(String spriteUrl) {
        this.spriteUrl = spriteUrl;
    }

    public int getHp() {
        return hp;
    }

    public void setHp(int hp) {
        this.hp = hp;
    }

    public int getAttack() {
        return attack;
    }

    public void setAttack(int attack) {
        this.attack = attack;
    }

    public int getDefense() {
        return defense;
    }

    public void setDefense(int defense) {
        this.defense = defense;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public int getSpecialAttack() {
        return specialAttack;
    }

    public void setSpecialAttack(int specialAttack) {
        this.specialAttack = specialAttack;
    }

    public int getSpecialDefense() {
        return specialDefense;
    }

    public void setSpecialDefense(int specialDefense) {
        this.specialDefense = specialDefense;
    }

    public Set<Type> getTypes() {
        return types;
    }

    public void setTypes(Set<Type> types) {
        this.types = types;
    }

    public Set<Ability> getAbilities() {
        return abilities;
    }

    public void setAbilities(Set<Ability> abilities) {
        this.abilities = abilities;
    }

    public PokemonDTO getEvolvesFrom() {
        return evolvesFrom;
    }

    public void setEvolvesFrom(PokemonDTO evolvesFrom) {
        this.evolvesFrom = evolvesFrom;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}