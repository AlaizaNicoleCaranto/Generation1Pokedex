package com.gen1pokedex.controller;

import com.gen1pokedex.dto.BattleRequest;
import com.gen1pokedex.dto.BattleResult;
import com.gen1pokedex.service.BattleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

// Controller for Pokemon battle simulation endpoints
@RestController
@RequestMapping("/api/battle")
public class BattleController {

    // Service that handles Pokemon battle simulation logic
    @Autowired
    private BattleService battleService;

    // Simulate a battle between two Pokemon and return the result
    @PostMapping("/simulate")
    public BattleResult simulateBattle(@RequestBody BattleRequest battleRequest) {
        return battleService.simulateBattle(battleRequest.getPokemon1Id(), battleRequest.getPokemon2Id());
    }
}