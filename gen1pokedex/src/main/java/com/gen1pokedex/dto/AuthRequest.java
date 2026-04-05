package com.gen1pokedex.dto;

public class AuthRequest {
    private String username; // login or registration username
    private String password; // login password from the client

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}