package com.gen1pokedex.repository;

import com.gen1pokedex.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BadgeRepo extends JpaRepository<Badge, Long> {
    // Find a badge by its unique badge code
    Optional<Badge> findByCode(String code);
}