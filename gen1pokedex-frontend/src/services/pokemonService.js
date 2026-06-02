import api from './api';

// Pokemon service - handles all Pokemon data operations
export const pokemonService = {
    // Fetch all Pokemon with pagination - 20 items per page, sorted by Pokedex number
    getAll: async (page = 0, size = 20, sort = 'number,asc') => {
        const response = await api.get('/pokemons', { params: { page, size, sort } });
        return response.data;
    },

    // Get single Pokemon by database ID
    getById: async (id) => {
        const response = await api.get(`/pokemons/${id}`);
        return response.data;
    },

    // Get Pokemon by Pokedex number (1-151)
    getByNumber: async (number) => {
        const response = await api.get(`/pokemons/number/${number}`);
        return response.data;
    },

    // Get Pokemon by exact name (case insensitive)
    getByName: async (name) => {
        const response = await api.get(`/pokemons/name/${name}`);
        return response.data;
    },

    // Search Pokemon by partial name match
    searchByName: async (name) => {
        const response = await api.get('/pokemons/search', { params: { name } });
        return response.data;
    },

    // Advanced search with multiple filters
    advancedSearch: async ({ name, number, type, rarity, habitat }) => {
        const response = await api.get('/pokemons/search', { params: { name, number, type, rarity, habitat } });
        return response.data;
    },

    // Filter Pokemon by type
    filterByType: async (type) => {
        const response = await api.get(`/pokemons/type/${type}`);
        return response.data;
    },

    // Filter Pokemon by rarity (Common, Rare, Legendary)
    filterByRarity: async (rarity) => {
        const response = await api.get(`/pokemons/rarity/${rarity}`);
        return response.data;
    },

    // Filter Pokemon by habitat
    filterByHabitat: async (habitat) => {
        const response = await api.get(`/pokemons/habitat/${habitat}`);
        return response.data;
    },

    // Get a random Pokemon
    getRandom: async () => {
        const response = await api.get('/pokemons/random');
        return response.data;
    },

    // Get name suggestions for autocomplete
    getSuggestions: async (prefix) => {
        const response = await api.get('/pokemons/suggestions', { params: { prefix } });
        return response.data;
    },

    // Admin: Create new Pokemon
    createPokemon: async (pokemonData) => {
        const response = await api.post('/admin/pokemons', pokemonData);
        return response.data;
    },

    // Admin: Update existing Pokemon
    updatePokemon: async (id, pokemonData) => {
        const response = await api.put(`/admin/pokemons/${id}`, pokemonData);
        return response.data;
    },

    // Admin: Delete Pokemon
    deletePokemon: async (id) => {
        const response = await api.delete(`/admin/pokemons/${id}`);
        return response.data;
    }
};