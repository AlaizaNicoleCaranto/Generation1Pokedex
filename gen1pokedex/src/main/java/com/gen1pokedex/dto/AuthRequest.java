package com.gen1pokedex.dto;

public class AuthRequest {
    private String username; // login or registration username
    private String password; // login password from the client
    private String email; // optional email for registration

    // Getters and setters for username, password, and email
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}