package com.gen1pokedex.entity;

// Enum to track trainer account status across the application
public enum UserStatus {
    ACTIVE, // Account is active and can play normally
    BANNED, // Account is banned (permanently disabled)
    SUSPENDED // Account is suspended temporarily (can be reactivated)
}
