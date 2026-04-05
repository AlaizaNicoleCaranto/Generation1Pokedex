package com.gen1pokedex.service;

import com.gen1pokedex.entity.*; // Domain model entities for user, badges, and challenges
import com.gen1pokedex.repository.*; // Repositories for accessing persisted data
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AchievementService {

    @Autowired
    private UserRepo userRepository; // access users and their collections

    @Autowired
    private BadgeRepo badgeRepository; // lookup badge definitions by code

    @Autowired
    private UserBadgeRepo userBadgeRepository; // track badges earned by users

    @Autowired
    private UserDailyChallengeRepo userDailyChallengeRepository; // track daily challenge completion

    // Check and award badges for user
    @Transactional
    public List<Badge> checkAndAwardBadges(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<Badge> newlyEarned = new ArrayList<>();

        // Check for catch count badges
        int catchCount = user.getPokemons().size();
        awardBadgeIfNeeded(user, "CATCH_10", catchCount, 10, newlyEarned);
        awardBadgeIfNeeded(user, "CATCH_50", catchCount, 50, newlyEarned);
        awardBadgeIfNeeded(user, "CATCH_100", catchCount, 100, newlyEarned);
        awardBadgeIfNeeded(user, "CATCH_151", catchCount, 151, newlyEarned);

        // Check for completion percentage badge
        double completionPercentage = (catchCount / 151.0) * 100;
        if (completionPercentage >= 100) {
            awardBadgeIfNeeded(user, "COMPLETE_MASTER", 1, 1, newlyEarned);
        } else if (completionPercentage >= 50) {
            awardBadgeIfNeeded(user, "COMPLETE_HALF", 1, 1, newlyEarned);
        }

        // Check for streak badge
        int streak = calculateStreak(user);
        awardBadgeIfNeeded(user, "STREAK_7", streak, 7, newlyEarned);
        awardBadgeIfNeeded(user, "STREAK_30", streak, 30, newlyEarned);

        return newlyEarned;
    }

    // Helper method to award badge if criteria met and not already owned
    private void awardBadgeIfNeeded(User user, String badgeCode, int currentValue, int required,
            List<Badge> newlyEarned) {
        // Check if user already has this badge
        boolean alreadyHas = userBadgeRepository.findByUserOrderByEarnedDateDesc(user)
                .stream()
                .anyMatch(ub -> ub.getBadge().getCode().equals(badgeCode));

        if (!alreadyHas && currentValue >= required) {
            Badge badge = badgeRepository.findByCode(badgeCode)
                    .orElseThrow(() -> new RuntimeException("Badge not found: " + badgeCode));

            UserBadge userBadge = new UserBadge();
            userBadge.setUser(user);
            userBadge.setBadge(badge);
            userBadge.setEarnedDate(LocalDateTime.now());

            userBadgeRepository.save(userBadge);
            newlyEarned.add(badge);
        }
    }

    // Get user's badges
    public List<Badge> getUserBadges(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return userBadgeRepository.findByUserOrderByEarnedDateDesc(user)
                .stream()
                .map(UserBadge::getBadge)
                .toList();
    }

    // Calculate streak (reuse from DailyChallengeService)
    private int calculateStreak(User user) {
        List<UserDailyChallenge> completions = userDailyChallengeRepository
                .findByUserOrderByCompletionDateDesc(user);

        if (completions.isEmpty()) {
            return 0;
        }

        int streak = 0;
        java.time.LocalDate expectedDate = java.time.LocalDate.now();

        for (UserDailyChallenge completion : completions) {
            if (completion.getCompletionDate().equals(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else {
                break;
            }
        }

        return streak;
    }
}