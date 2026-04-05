package com.gen1pokedex.dto;

public class BattleResult {
    private String winner; // winning Pokémon name
    private String winnerSprite; // winner sprite URL
    private String loser; // losing Pokémon name
    private String loserSprite; // loser sprite URL
    private String battleLog; // text log of the battle steps
    private int winnerHpRemaining; // winner HP after the battle

    public BattleResult(String winner, String winnerSprite, String loser, String loserSprite, String battleLog,
            int winnerHpRemaining) {
        this.winner = winner;
        this.winnerSprite = winnerSprite;
        this.loser = loser;
        this.loserSprite = loserSprite;
        this.battleLog = battleLog;
        this.winnerHpRemaining = winnerHpRemaining;
    }

    // Getters
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
}