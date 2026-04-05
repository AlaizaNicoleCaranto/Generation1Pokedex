package com.gen1pokedex.repository;

import com.gen1pokedex.entity.DailyChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyChallengeRepo extends JpaRepository<DailyChallenge, Long> {
    // Find today's daily challenge by its challenge date
    Optional<DailyChallenge> findByChallengeDate(LocalDate date);
}