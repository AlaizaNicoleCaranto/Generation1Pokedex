package com.gen1pokedex.dto;

// DTO used to update user profile fields such as email and bio
public class UserProfileUpdateRequest {
    private String email; // updated trainer email
    private String bio; // updated trainer biography
    private String avatarUrl; // updated avatar image URL or data URI

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

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
