package com.gen1pokedex.exception;

// custom exception for pokemon not found
public class PokemonNotFoundException extends RuntimeException {

    public PokemonNotFoundException(String message) {
        super(message); // pass message to runtime
    }
}