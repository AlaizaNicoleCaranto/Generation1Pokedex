import { useState } from 'react';
import { pokemonService } from '../../services/pokemonService';
import soundService from '../../services/soundService';

/**
 * Search and filter component for Pokedex
 * Allows searching by name OR Pokedex number, and filtering by type, rarity, habitat
 * Fixed: Autocomplete suggestions now appear ABOVE the cards (proper z-index)
 */
const PokemonSearch = ({ onSearch, onFilter, onReset }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [selectedRarity, setSelectedRarity] = useState('');
    const [selectedHabitat, setSelectedHabitat] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const types = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting',
        'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon'];
    const rarities = ['Common', 'Rare', 'Legendary'];
    const habitats = ['Forest', 'Mountain', "Water's Edge", 'Cave', 'Grassland', 'Sky'];

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchType === 'name' && value.length > 1) {
            const suggestions = await pokemonService.getSuggestions(value);
            setSuggestions(suggestions);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSearch = async () => {
        soundService.playClickSound();

        if (searchTerm.trim()) {
            let results;
            if (searchType === 'number') {
                const number = parseInt(searchTerm);
                if (!isNaN(number) && number >= 1 && number <= 151) {
                    const pokemon = await pokemonService.getByNumber(number);
                    results = pokemon ? [pokemon] : [];
                } else {
                    results = [];
                }
            } else {
                results = await pokemonService.searchByName(searchTerm);
            }
            onSearch(results);
        } else {
            onReset();
        }
        setShowSuggestions(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const applyFilters = () => {
        soundService.playClickSound();
        onFilter(selectedType, selectedRarity, selectedHabitat);
    };

    const resetFilters = () => {
        soundService.playClickSound();
        setSelectedType('');
        setSelectedRarity('');
        setSelectedHabitat('');
        setSearchTerm('');
        setSearchType('name');
        onReset();
    };

    const selectSuggestion = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        setTimeout(() => handleSearch(), 100);
    };

    return (
        <div className="relative z-20 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-retro-green/30">
            {/* Search Bar Section */}
            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <div className="flex gap-1 bg-black/50 rounded-lg p-1">
                        <button
                            onClick={() => setSearchType('name')}
                            className={`px-3 py-1 font-pixel text-xs rounded transition-colors ${searchType === 'name' ? 'bg-retro-green text-black' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            NAME
                        </button>
                        <button
                            onClick={() => setSearchType('number')}
                            className={`px-3 py-1 font-pixel text-xs rounded transition-colors ${searchType === 'number' ? 'bg-retro-green text-black' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            NUMBER
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                        <input
                            type={searchType === 'number' ? 'number' : 'text'}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            onFocus={() => searchType === 'name' && searchTerm.length > 1 && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder={searchType === 'number' ? "Search by Pokedex number (1-151)..." : "Search Pokemon by name..."}
                            className="w-full px-4 py-2 bg-black/60 border border-retro-green rounded text-white focus:outline-none focus:border-retro-gold"
                            min="1"
                            max="151"
                        />

                        {/* Autocomplete Suggestions Dropdown - Fixed z-index to appear ABOVE cards */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-retro-green rounded-lg z-50 max-h-48 overflow-y-auto shadow-xl">
                                {suggestions.map((suggestion, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => selectSuggestion(suggestion)}
                                        className="px-4 py-2 hover:bg-retro-green/20 cursor-pointer font-retro text-white transition-colors"
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleSearch} className="btn-primary">
                            SEARCH
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn-secondary"
                        >
                            FILTER {showFilters ? '▲' : '▼'}
                        </button>
                        <button onClick={resetFilters} className="btn-secondary">
                            RESET
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Panel - Expandable */}
            {showFilters && (
                <div className="mt-4 p-4 bg-black/50 rounded-lg border border-retro-green/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-pixel text-xs text-gray-400 mb-2">POKEMON TYPE</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                            >
                                <option value="">All Types</option>
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-pixel text-xs text-gray-400 mb-2">RARITY</label>
                            <select
                                value={selectedRarity}
                                onChange={(e) => setSelectedRarity(e.target.value)}
                                className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                            >
                                <option value="">All Rarities</option>
                                {rarities.map(rarity => (
                                    <option key={rarity} value={rarity}>{rarity}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-pixel text-xs text-gray-400 mb-2">HABITAT</label>
                            <select
                                value={selectedHabitat}
                                onChange={(e) => setSelectedHabitat(e.target.value)}
                                className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                            >
                                <option value="">All Habitats</option>
                                {habitats.map(habitat => (
                                    <option key={habitat} value={habitat}>{habitat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button onClick={applyFilters} className="btn-primary">
                            APPLY FILTERS
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonSearch;