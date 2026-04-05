package com.gen1pokedex.repository;

import com.gen1pokedex.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {

    // Find a user by username
    Optional<User> findByUsername(String username);

    // Check whether a username already exists
    boolean existsByUsername(String username);
}