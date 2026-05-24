package com.gen1pokedex.dto;

// BattleResult DTO - Contains the outcome of a Pokemon battle simulation
// This is what the frontend receives after a battle

public class BattleResult {
    private String winner; // Name of the winning Pokemon
    private String winnerSprite; // Sprite URL of the winner
    private String loser; // Name of the losing Pokemon
    private String loserSprite; // Sprite URL of the loser
    private String battleLog; // Complete battle history text
    private int winnerHpRemaining; // Winner's HP after battle
    private int xpGained; // XP earned by winner (NEW)
    private int newLevel; // Winner's new level after XP gain (NEW)

    // Constructor - Updated with XP fields
    public BattleResult(String winner, String winnerSprite, String loser, String loserSprite,
            String battleLog, int winnerHpRemaining, int xpGained, int newLevel) {
        this.winner = winner;
        this.winnerSprite = winnerSprite;
        this.loser = loser;
        this.loserSprite = loserSprite;
        this.battleLog = battleLog;
        this.winnerHpRemaining = winnerHpRemaining;
        this.xpGained = xpGained;
        this.newLevel = newLevel;
    }

    // Getters for all fields
    public String getWinner() {
        return winner;
    }

    public String getWinnerSprite() {
        return winnerSprite;
    }

    public String getLoser() {
        return loser;
    }

    public String getLoserSprite() {
        return loserSprite;
    }

    public String getBattleLog() {
        return battleLog;
    }

    public int getWinnerHpRemaining() {
        return winnerHpRemaining;
    }

    public int getXpGained() {
        return xpGained;
    }

    public int getNewLevel() {
        return newLevel;
    }
}