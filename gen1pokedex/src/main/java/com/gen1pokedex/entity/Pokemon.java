package com.gen1pokedex.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "pokemons")
public class Pokemon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // primary key for Pokémon records

    private int pokedexNumber; // Keep as int - DO NOT change to String

    private String name; // Pokémon name in title case

    private double height; // height in meters

    private double weight; // weight in kilograms

    private String description; // flavor text or Pokémon description

    private String habitat; // habitat type like Forest, Cave, Water, etc., or "Unknown" if not specified

    private String region; // region name, e.g. Kanto

    private String rarity; // rarity tier like Common, Rare, Legendary

    private String spriteUrl; // frontend sprite image URL

    // Stats
    private int hp; // health points
    private int attack; // attack stat
    private int defense; // defense stat
    private int speed; // speed stat
    private int specialAttack; // special attack stat
    private int specialDefense; // special defense stat

    @ManyToMany
    @JoinTable(name = "pokemon_types", joinColumns = @JoinColumn(name = "pokemon_id"), inverseJoinColumns = @JoinColumn(name = "type_id"))
    private Set<Type> types = new HashSet<>(); // Pokémon type relationships

    @ManyToMany
    @JoinTable(name = "pokemon_abilities", joinColumns = @JoinColumn(name = "pokemon_id"), inverseJoinColumns = @JoinColumn(name = "ability_id"))
    private Set<Ability> abilities = new HashSet<>(); // Pokémon abilities

    @ManyToOne
    @JoinColumn(name = "evolves_from_id")
    private Pokemon evolvesFrom; // previous evolution stage

    @OneToMany(mappedBy = "evolvesFrom")
    @JsonIgnore
    private List<Pokemon> evolvesTo = new ArrayList<>(); // next evolution stages

    // Helper method for frontend formatting - not stored in database
    @Transient
    public String getFormattedNumber() {
        return String.format("%03d", this.pokedexNumber);
    }

    // GETTERS AND SETTERS
    public Long getId() {
        return id;
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

    public Pokemon getEvolvesFrom() {
        return evolvesFrom;
    }

    public void setEvolvesFrom(Pokemon evolvesFrom) {
        this.evolvesFrom = evolvesFrom;
    }

    public List<Pokemon> getEvolvesTo() {
        return evolvesTo;
    }
}