package com.gen1pokedex.dto;

public class AuthResponse {
    private String token; // JWT access token returned after login
    private String username; // authenticated username

    public AuthResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }
}