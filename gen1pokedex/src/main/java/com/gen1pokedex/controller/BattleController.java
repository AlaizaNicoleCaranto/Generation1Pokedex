package com.gen1pokedex.controller;

import com.gen1pokedex.dto.BattleRequest;
import com.gen1pokedex.dto.BattleResult;
import com.gen1pokedex.service.BattleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

// Controller for Pokemon battle simulation endpoints
// All battle endpoints require authentication (user must be logged in)
@RestController
@RequestMapping("/api/battle")
public class BattleController {

    // Service that handles Pokemon battle simulation logic
    @Autowired
    private BattleService battleService;

    // Simulate a battle between two Pokemon and return the result
    // Requires authentication - user must be logged in
    @PostMapping("/simulate")
    @PreAuthorize("isAuthenticated()")
    public BattleResult simulateBattle(@RequestBody BattleRequest battleRequest) {
        return battleService.simulateBattle(battleRequest.getPokemon1Id(), battleRequest.getPokemon2Id());
    }
}