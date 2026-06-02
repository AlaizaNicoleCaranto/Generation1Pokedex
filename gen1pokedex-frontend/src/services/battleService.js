import api from './api';

// Battle service - handles Pokemon battle simulation
// Connects to backend /api/battle/simulate endpoint
export const battleService = {
    // Simulate a battle between two Pokemon owned by the user
    // @param pokemon1Id - ID of first Pokemon (from user's collection)
    // @param pokemon2Id - ID of second Pokemon (from user's collection)
    // @returns BattleResult object with winner, loser, battle log, XP gained, and level ups
    // Simulate battle between 2 Pokemon - returns winner, XP gained, level ups
    simulateBattle: async (pokemon1Id, pokemon2Id) => {
        const response = await api.post('/battle/simulate', { pokemon1Id, pokemon2Id });
        return response.data;
    }
};