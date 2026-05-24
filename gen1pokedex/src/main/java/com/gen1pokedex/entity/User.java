package com.gen1pokedex.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String username; // unique trainer name

        @JsonIgnore
        private String password; // encoded password should never be serialized

        private String email; // contact email for the user

        private String bio; // optional trainer bio/profile description

        private String role = "USER"; // role for access control: USER or ADMIN

        // account status: ACTIVE, BANNED, or SUSPENDED
        @Enumerated(EnumType.STRING)
        private UserStatus status = UserStatus.ACTIVE; // default to active when registered

        // timestamp when account was created
        @Column(updatable = false)
        private LocalDateTime createdAt; // set once on creation, never updated

        // timestamp of last profile/account modification
        private LocalDateTime updatedAt; // updated whenever user data changes

        // timestamp of most recent successful login
        private LocalDateTime lastLogin; // tracks when user last accessed the app

        //TODO:Edit out
        // personal collection of caught Pokémon
        @ManyToMany
        @JoinTable(name = "user_pokemons", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "pokemon_id"))
        private Set<Pokemon> pokemons = new HashSet<>(); // Pokémon in trainer's collection

        //TODO:Edit out
        // favorite Pokémon
        @ManyToMany
        @JoinTable(name = "user_favorites", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "pokemon_id"))
        private Set<Pokemon> favorites = new HashSet<>(); // favorite Pokémon set

        // getters/setters
        public Long getId() {
                return id;
        }

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

        public String getBio() {
                return bio;
        }

        public void setBio(String bio) {
                this.bio = bio;
        }

        public String getRole() {
                return role;
        }

        public void setRole(String role) {
                this.role = role;
        }

        public Set<Pokemon> getPokemons() {
                return pokemons;
        }

        public void setPokemons(Set<Pokemon> pokemons) {
                this.pokemons = pokemons;
        }

        public Set<Pokemon> getFavorites() {
                return favorites;
        }

        public void setFavorites(Set<Pokemon> favorites) {
                this.favorites = favorites;
        }

        public UserStatus getStatus() {
                return status; // retrieve current account status
        }

        public void setStatus(UserStatus status) {
                this.status = status; // update account status for bans/suspensions
        }

        public LocalDateTime getCreatedAt() {
                return createdAt; // get account creation timestamp
        }

        public void setCreatedAt(LocalDateTime createdAt) {
                this.createdAt = createdAt; // set on account creation (admin only)
        }

        public LocalDateTime getUpdatedAt() {
                return updatedAt; // get last update timestamp
        }

        public void setUpdatedAt(LocalDateTime updatedAt) {
                this.updatedAt = updatedAt; // update whenever account data changes
        }

        public LocalDateTime getLastLogin() {
                return lastLogin; // get most recent login time
        }

        public void setLastLogin(LocalDateTime lastLogin) {
                this.lastLogin = lastLogin; // set after successful authentication
        }
}