import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { pokemonService } from '../../services/pokemonService';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import PokemonCard from './PokemonCard';
import PokemonSearch from './PokemonSearch';
import PixelButton from '../common/PixelButton';
import soundService from '../../services/soundService';

/**
 * Pokedex Grid - Displays all Pokemon in a card grid
 * Features: Search, Filter, Pagination, Add Pokemon (Admin only)
 */
const PokedexGrid = () => {
    const { userProfile } = useAuth();
    const [pokemons, setPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [adding, setAdding] = useState(false);
    const [addMessage, setAddMessage] = useState(null);
    const itemsPerPage = 20;

    const isAdmin = userProfile?.role === 'ADMIN';

    // Add Pokemon form state
    const [newPokemon, setNewPokemon] = useState({
        pokedexNumber: '',
        name: '',
        hp: '',
        attack: '',
        defense: '',
        speed: '',
        specialAttack: '',
        specialDefense: '',
        height: '',
        weight: '',
        habitat: '',
        rarity: 'Common',
        description: '',
        spriteUrl: ''
    });

    useEffect(() => {
        fetchPokemons();
    }, [currentPage]);

    const fetchPokemons = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await pokemonService.getAll(currentPage, itemsPerPage, 'pokedexNumber,asc');

            if (data && data.length > 0) {
                setPokemons(data);
                setFilteredPokemons(data);
                setTotalPages(Math.ceil(151 / itemsPerPage));
            } else {
                setError('No Pokemon found. Please check if backend is running.');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('❌ Failed to connect to server. Make sure backend is running on port 8080');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchResults) => {
        setFilteredPokemons(searchResults);
        setCurrentPage(0);
    };

    const handleFilter = async (type, rarity, habitat) => {
        try {
            setLoading(true);
            const results = await pokemonService.advancedSearch({ type, rarity, habitat });
            setFilteredPokemons(results);
            setCurrentPage(0);
        } catch (err) {
            setError('Filter failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        await fetchPokemons();
    };

    // Admin: Add new Pokemon
    const handleAddPokemon = async (e) => {
        e.preventDefault();
        setAdding(true);
        setAddMessage(null);
        soundService.playClickSound();

        try {
            const pokemonData = {
                pokedexNumber: parseInt(newPokemon.pokedexNumber),
                name: newPokemon.name,
                hp: parseInt(newPokemon.hp),
                attack: parseInt(newPokemon.attack),
                defense: parseInt(newPokemon.defense),
                speed: parseInt(newPokemon.speed),
                specialAttack: parseInt(newPokemon.specialAttack) || 0,
                specialDefense: parseInt(newPokemon.specialDefense) || 0,
                height: parseFloat(newPokemon.height) || 0,
                weight: parseFloat(newPokemon.weight) || 0,
                habitat: newPokemon.habitat,
                rarity: newPokemon.rarity,
                description: newPokemon.description,
                spriteUrl: newPokemon.spriteUrl,
                types: [],
                abilities: []
            };

            await pokemonService.createPokemon(pokemonData);
            setAddMessage(`✅ ${newPokemon.name} added successfully!`);
            setNewPokemon({
                pokedexNumber: '',
                name: '',
                hp: '',
                attack: '',
                defense: '',
                speed: '',
                specialAttack: '',
                specialDefense: '',
                height: '',
                weight: '',
                habitat: '',
                rarity: 'Common',
                description: '',
                spriteUrl: ''
            });
            setTimeout(() => setShowAddModal(false), 2000);
            await fetchPokemons();
        } catch (err) {
            setAddMessage(`❌ Failed: ${err.response?.data?.message || 'Unknown error'}`);
        } finally {
            setAdding(false);
            setTimeout(() => setAddMessage(null), 3000);
        }
    };

    if (loading && currentPage === 0) return <LoadingSpinner fullScreen />;

    if (error) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="bg-black/80 pixel-border p-8 text-center max-w-md">
                    <div className="text-5xl mb-4">⚠️</div>
                    <p className="font-pixel text-pixel-red text-sm mb-4">{error}</p>
                    <button onClick={fetchPokemons} className="btn-primary">TRY AGAIN</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 relative">
            {/* Dark background for readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]"></div>

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Header with Add Button for Admin */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="font-pixel text-3xl text-retro-green mb-2">POKEDEX</h1>
                        <p className="font-retro text-lg text-gray-400">Gen 1 - 151 Pokemon</p>
                        <div className="flex gap-1 mt-3">
                            {[...Array(8)].map((_, i) => (<div key={i} className="w-4 h-0.5 bg-retro-green"></div>))}
                        </div>
                    </div>

                    {/* ADD BUTTON - Only for Admin */}
                    {isAdmin && (
                        <button
                            onClick={() => {
                                soundService.playClickSound();
                                setShowAddModal(true);
                            }}
                            className="px-4 py-2 bg-retro-green text-black font-pixel text-sm rounded-lg hover:bg-green-500 transition-all flex items-center gap-2"
                        >
                            <span className="text-lg">+</span> ADD POKEMON
                        </button>
                    )}
                </div>

                {/* Search and Filter Component */}
                <PokemonSearch onSearch={handleSearch} onFilter={handleFilter} onReset={handleReset} />

                {/* Pokemon Grid - 5x4 = 20 cards per page */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                    {filteredPokemons.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                </div>

                {filteredPokemons.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="font-pixel text-gray-400">🔍 No Pokemon found matching your search.</p>
                        <button onClick={handleReset} className="mt-4 btn-primary">RESET FILTERS</button>
                    </div>
                )}

                {/* Pagination */}
                {filteredPokemons.length === pokemons.length && filteredPokemons.length > 0 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="px-3 py-1 text-gray-400 hover:text-retro-green transition-colors disabled:opacity-30 font-pixel text-xs"
                        >
                            ◀ PREV
                        </button>
                        <span className="font-pixel text-xs text-gray-400">{currentPage + 1} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="px-3 py-1 text-gray-400 hover:text-retro-green transition-colors disabled:opacity-30 font-pixel text-xs"
                        >
                            NEXT ▶
                        </button>
                    </div>
                )}

                {/* Add Pokemon Modal - Admin Only */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-auto">
                        <div className="bg-[#1a1a2e] border border-retro-green rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-pixel text-xl text-retro-green">➕ ADD NEW POKEMON</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-pixel-red font-pixel text-xl hover:text-red-500"
                                >
                                    ✕
                                </button>
                            </div>

                            {addMessage && (
                                <div className={`mb-4 p-3 rounded-lg text-center ${addMessage.includes('✅') ? 'bg-retro-green/20 text-retro-green' : 'bg-pixel-red/20 text-pixel-red'}`}>
                                    <p className="font-pixel text-xs">{addMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleAddPokemon} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-pixel text-xs text-gray-400 mb-1">Pokedex Number (1-151)</label>
                                        <input
                                            type="number"
                                            value={newPokemon.pokedexNumber}
                                            onChange={(e) => setNewPokemon({ ...newPokemon, pokedexNumber: e.target.value })}
                                            className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                            required
                                            min="1"
                                            max="151"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-gray-400 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={newPokemon.name}
                                            onChange={(e) => setNewPokemon({ ...newPokemon, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-gray-400 mb-1">HP</label>
                                        <input
                                            type="number"
                                            value={newPokemon.hp}
                                            onChange={(e) => setNewPokemon({ ...newPokemon, hp: e.target.value })}
                                            className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-gray-400 mb-1">Attack</label>
                                        <input
                                            type="number"
                                            value={newPokemon.attack}
                                            onChange={(e) => setNewPokemon({ ...newPokemon, attack: e.target.value })}
                                            className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-gray-400 mb-1">Defense</label>
                                        <input
                                            type="number"
                                            value={newPokemon.defense}
                                            onChange={(e) => setNewPokemon({ ...newPokemon, defense: e.target.value })}
                                            className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-gray-400 mb-1">Speed</label>
                                        <input
                                            type="number"
                                            value={newPokemon.speed}
                                            onChange={(e) => setNewPokemon({ ...newPokemon, speed: e.target.value })}
                                            className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-gray-400 mb-1">Rarity</label>
                                        <select
                                            value={newPokemon.rarity}
                                            onChange={(e) => setNewPokemon({ ...newPokemon, rarity: e.target.value })}
                                            className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                        >
                                            <option value="Common">Common</option>
                                            <option value="Rare">Rare</option>
                                            <option value="Legendary">Legendary</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-gray-400 mb-1">Habitat</label>
                                        <input
                                            type="text"
                                            value={newPokemon.habitat}
                                            onChange={(e) => setNewPokemon({ ...newPokemon, habitat: e.target.value })}
                                            className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                            placeholder="Forest, Cave, Mountain..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-pixel text-xs text-gray-400 mb-1">Description</label>
                                    <textarea
                                        value={newPokemon.description}
                                        onChange={(e) => setNewPokemon({ ...newPokemon, description: e.target.value })}
                                        className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block font-pixel text-xs text-gray-400 mb-1">Sprite URL (optional)</label>
                                    <input
                                        type="text"
                                        value={newPokemon.spriteUrl}
                                        onChange={(e) => setNewPokemon({ ...newPokemon, spriteUrl: e.target.value })}
                                        className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={adding} className="flex-1 btn-primary">
                                        {adding ? 'ADDING...' : 'ADD POKEMON'}
                                    </button>
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary">
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PokedexGrid;