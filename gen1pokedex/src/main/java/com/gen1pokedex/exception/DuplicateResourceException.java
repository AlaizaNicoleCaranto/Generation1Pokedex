package com.gen1pokedex.exception;

// duplicate entry error
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}