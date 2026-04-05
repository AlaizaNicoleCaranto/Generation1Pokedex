package com.gen1pokedex.exception;

// Thrown when user attempts action on a banned account
public class UserBannedException extends RuntimeException {
    // Constructor with custom error message for banned users
    public UserBannedException(String message) {
        super(message); // passes message to parent RuntimeException
    }
}
