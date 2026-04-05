package com.gen1pokedex.repository;

import com.gen1pokedex.entity.User;
import com.gen1pokedex.entity.UserDailyChallenge;
import com.gen1pokedex.entity.DailyChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDailyChallengeRepo extends JpaRepository<UserDailyChallenge, Long> {
    // Find the daily challenge record for a specific user and challenge
    Optional<UserDailyChallenge> findByUserAndDailyChallenge(User user, DailyChallenge dailyChallenge);

    // List a user's daily challenge history, newest first
    List<UserDailyChallenge> findByUserOrderByCompletionDateDesc(User user);
}