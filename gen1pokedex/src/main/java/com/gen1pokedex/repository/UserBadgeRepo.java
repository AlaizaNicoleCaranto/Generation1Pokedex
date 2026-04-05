package com.gen1pokedex.repository;

import com.gen1pokedex.entity.User;
import com.gen1pokedex.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBadgeRepo extends JpaRepository<UserBadge, Long> {
    // Retrieve all badges earned by a user, sorted newest first
    List<UserBadge> findByUserOrderByEarnedDateDesc(User user);

    // Count how many badges a user has earned
    long countByUser(User user);
}