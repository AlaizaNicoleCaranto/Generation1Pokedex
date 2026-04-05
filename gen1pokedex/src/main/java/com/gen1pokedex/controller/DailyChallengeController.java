package com.gen1pokedex.controller;

import com.gen1pokedex.dto.DailyChallengeDTO;
import com.gen1pokedex.service.DailyChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

// Controller for daily challenge endpoints, including today's Pokemon and streak tracking
@RestController
@RequestMapping("/api/daily-challenge")
public class DailyChallengeController {

    // Service for daily challenge operations and streak tracking
    @Autowired
    private DailyChallengeService dailyChallengeService;

    // Fetch today's featured challenge Pokemon
    @GetMapping("/today")
    public DailyChallengeDTO getTodayChallenge() {
        return dailyChallengeService.getTodayChallenge();
    }

    // Claim the daily challenge reward for the specified user
    @PostMapping("/{username}/claim")
    public String claimChallenge(@PathVariable String username) {
        return dailyChallengeService.claimChallenge(username);
    }

    // Return the current daily challenge streak for the user
    @GetMapping("/{username}/streak")
    public int getUserStreak(@PathVariable String username) {
        return dailyChallengeService.getUserStreak(username);
    }
}