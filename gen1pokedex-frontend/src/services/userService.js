import api from './api';

// User service - handles user profile, collection, and gameplay operations
export const userService = {
    // Get full user profile with all stats
    getProfile: async (username) => {
        const response = await api.get(`/users/${username}/profile`);
        return response.data;
    },

    // Get user's caught Pokemon collection
    getCollection: async (username) => {
        const response = await api.get(`/users/${username}/collection`);
        return response.data;
    },

    // Get user's favorite Pokemon list
    getFavorites: async (username) => {
        const response = await api.get(`/users/${username}/favorites`);
        return response.data;
    },

    // Get all badges earned by user
    getBadges: async (username) => {
        const response = await api.get(`/users/${username}/badges`);
        return response.data;
    },

    // Catch a new Pokemon - adds to user's collection
    catchPokemon: async (username, pokemonId) => {
        const response = await api.post(`/users/${username}/catch/${pokemonId}`);
        return response.data;
    },

    // Release a Pokemon - removes from collection and favorites
    releasePokemon: async (username, userPokemonId) => {
        const response = await api.delete(`/users/${username}/release/${userPokemonId}`);
        return response.data;
    },

    // Mark a Pokemon as favorite
    addFavorite: async (username, userPokemonId) => {
        const response = await api.post(`/users/${username}/favorite/${userPokemonId}`);
        return response.data;
    },

    // Remove a Pokemon from favorites
    removeFavorite: async (username, userPokemonId) => {
        const response = await api.delete(`/users/${username}/favorite/${userPokemonId}`);
        return response.data;
    },

    // Update user profile (email and/or bio)
    updateProfile: async (username, email, bio) => {
        const response = await api.put(`/users/${username}/profile`, { email, bio });
        return response.data;
    },

    // Get Pokedex completion percentage (caught / 151 * 100)
    getCompletion: async (username) => {
        const response = await api.get(`/users/${username}/completion`);
        return response.data;
    },

    // Get global leaderboard (top trainers by Pokemon count)
    getLeaderboard: async () => {
        const response = await api.get('/users/leaderboard');
        return response.data;
    },

    // Get a random user profile for discovery feature
    getRandomUser: async () => {
        const response = await api.get('/users/random');
        return response.data;
    },

    // Get today's daily challenge
    getTodayChallenge: async () => {
        const response = await api.get('/daily-challenge/today');
        return response.data;
    },

    // Claim daily challenge reward
    claimChallenge: async (username) => {
        const response = await api.post(`/daily-challenge/${username}/claim`);
        return response.data;
    },

    // Get user's daily challenge streak count
    getStreak: async (username) => {
        const response = await api.get(`/daily-challenge/${username}/streak`);
        return response.data;
    }
};