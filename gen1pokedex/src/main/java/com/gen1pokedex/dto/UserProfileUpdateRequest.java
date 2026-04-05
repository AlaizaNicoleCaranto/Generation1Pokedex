package com.gen1pokedex.dto;

// DTO used to update user profile fields such as email and bio
public class UserProfileUpdateRequest {
    private String email; // updated trainer email
    private String bio; // updated trainer biography

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
