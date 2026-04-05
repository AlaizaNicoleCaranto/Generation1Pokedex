package com.gen1pokedex.exception;

// Thrown when user attempts action on a suspended (temporarily disabled) account
public class UserSuspendedException extends RuntimeException {
    // Constructor with custom error message for suspended users
    public UserSuspendedException(String message) {
        super(message); // passes message to parent RuntimeException
    }
}
