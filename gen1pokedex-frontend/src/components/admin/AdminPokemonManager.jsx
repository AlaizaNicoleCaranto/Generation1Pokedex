import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pokemonService } from '../../services/pokemonService';
import LoadingSpinner from '../common/LoadingSpinner';
import soundService from '../../services/soundService';

// Admin Pokemon Manager - Full CRUD operations for Pokemon
const AdminPokemonManager = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingPokemon, setEditingPokemon] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
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
        loadPokemons();
    }, []);

    const loadPokemons = async () => {
        try {
            setLoading(true);
            const data = await pokemonService.getAll(0, 200, 'pokedexNumber,asc');
            setPokemons(data);
        } catch (err) {
            setMessage('Failed to load Pokemon');
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        soundService.playClickSound();

        try {
            const pokemonData = {
                pokedexNumber: parseInt(formData.pokedexNumber),
                name: formData.name,
                hp: parseInt(formData.hp),
                attack: parseInt(formData.attack),
                defense: parseInt(formData.defense),
                speed: parseInt(formData.speed),
                specialAttack: parseInt(formData.specialAttack),
                specialDefense: parseInt(formData.specialDefense),
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight),
                habitat: formData.habitat,
                rarity: formData.rarity,
                description: formData.description,
                spriteUrl: formData.spriteUrl,
                types: [],
                abilities: []
            };

            if (editingPokemon) {
                await pokemonService.updatePokemon(editingPokemon.id, pokemonData);
                setMessage(`${formData.name} updated successfully!`);
            } else {
                await pokemonService.createPokemon(pokemonData);
                setMessage(`${formData.name} added successfully!`);
            }

            await loadPokemons();
            resetForm();
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Operation failed');
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (pokemon) => {
        if (window.confirm(`Are you sure you want to delete ${pokemon.name}? This cannot be undone!`)) {
            setLoading(true);
            soundService.playClickSound();
            try {
                await pokemonService.deletePokemon(pokemon.id);
                setMessage(`${pokemon.name} deleted successfully!`);
                await loadPokemons();
                setTimeout(() => setMessage(null), 3000);
            } catch (err) {
                setMessage('Failed to delete Pokemon');
                setTimeout(() => setMessage(null), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const editPokemon = (pokemon) => {
        setEditingPokemon(pokemon);
        setFormData({
            pokedexNumber: pokemon.pokedexNumber,
            name: pokemon.name,
            hp: pokemon.hp,
            attack: pokemon.attack,
            defense: pokemon.defense,
            speed: pokemon.speed,
            specialAttack: pokemon.specialAttack || 0,
            specialDefense: pokemon.specialDefense || 0,
            height: pokemon.height,
            weight: pokemon.weight,
            habitat: pokemon.habitat || '',
            rarity: pokemon.rarity || 'Common',
            description: pokemon.description || '',
            spriteUrl: pokemon.spriteUrl || ''
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingPokemon(null);
        setFormData({
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
    };

    const getSpriteUrl = (pokemon) => {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.pokedexNumber}.gif`;
    };

    const filteredPokemons = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.pokedexNumber.toString().includes(searchTerm)
    );

    if (loading && pokemons.length === 0) return <LoadingSpinner fullScreen />;

    return (
        <div className="min-h-screen p-6 relative overflow-auto">

            <div className="absolute inset-0 z-0 opacity-5">
                <div className="w-full h-full bg-repeat" style={{ backgroundImage: 'radial-gradient(#4ade80 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="font-pixel text-2xl text-pixel-red mb-2">📦 POKEMON MANAGER</h1>
                        <div className="flex gap-1">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-4 h-1 bg-pixel-red"></div>
                            ))}
                        </div>
                        <p className="font-retro text-sm mt-2">Add, edit, or remove Pokemon from the Pokedex</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="font-pixel text-xs text-text-muted hover:text-retro-green transition-colors"
                        >
                            ← BACK
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary text-sm"
                        >
                            + ADD NEW POKEMON
                        </button>
                    </div>
                </div>

                {/* Message Alert */}
                {message && (
                    <div className="mb-6 p-3 bg-retro-green/20 border border-retro-green rounded-lg text-center">
                        <p className="font-pixel text-xs text-retro-green-dark">{message}</p>
                    </div>
                )}

                {/* Search Bar */}
                <div className="glass-card p-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or Pokedex number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 input-retro"
                    />
                </div>

                {/* Pokemon Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredPokemons.map((pokemon) => (
                        <div key={pokemon.id} className="glass-card p-3 text-center hover:shadow-lg transition-all">
                            <img
                                src={getSpriteUrl(pokemon)}
                                alt={pokemon.name}
                                className="w-20 h-20 mx-auto pixelated"
                            />
                            <p className="font-pixel text-xs text-text-muted mt-1">#{String(pokemon.pokedexNumber).padStart(3, '0')}</p>
                            <p className="font-retro text-base text-text-dark font-semibold">{pokemon.name}</p>
                            <div className="flex gap-2 mt-2 justify-center">
                                <button
                                    onClick={() => editPokemon(pokemon)}
                                    className="px-2 py-1 bg-blue-100 border border-blue-300 rounded font-pixel text-[8px] text-blue-600 hover:bg-blue-200"
                                >
                                    EDIT
                                </button>
                                <button
                                    onClick={() => handleDelete(pokemon)}
                                    className="px-2 py-1 bg-pixel-red/10 border border-pixel-red rounded font-pixel text-[8px] text-pixel-red hover:bg-pixel-red/20"
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPokemons.length === 0 && (
                    <div className="text-center py-12">
                        <p className="font-pixel text-text-muted">No Pokemon found.</p>
                    </div>
                )}

                <div className="text-center mt-6">
                    <p className="font-retro text-xs text-text-muted">Total Pokemon: {filteredPokemons.length} / 151</p>
                </div>

                {/* Add/Edit Pokemon Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto">
                        <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <h3 className="font-pixel text-lg text-text-dark mb-4">
                                {editingPokemon ? 'EDIT POKEMON' : 'ADD NEW POKEMON'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Pokedex Number (1-151)</label>
                                        <input
                                            type="number"
                                            name="pokedexNumber"
                                            value={formData.pokedexNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                            required
                                            min="1"
                                            max="151"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">HP</label>
                                        <input
                                            type="number"
                                            name="hp"
                                            value={formData.hp}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Attack</label>
                                        <input
                                            type="number"
                                            name="attack"
                                            value={formData.attack}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Defense</label>
                                        <input
                                            type="number"
                                            name="defense"
                                            value={formData.defense}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Speed</label>
                                        <input
                                            type="number"
                                            name="speed"
                                            value={formData.speed}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Special Attack</label>
                                        <input
                                            type="number"
                                            name="specialAttack"
                                            value={formData.specialAttack}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Special Defense</label>
                                        <input
                                            type="number"
                                            name="specialDefense"
                                            value={formData.specialDefense}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Height (m)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="height"
                                            value={formData.height}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Habitat</label>
                                        <input
                                            type="text"
                                            name="habitat"
                                            value={formData.habitat}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                            placeholder="Forest, Cave, Mountain, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-pixel text-xs text-text-muted mb-1">Rarity</label>
                                        <select
                                            name="rarity"
                                            value={formData.rarity}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 input-retro"
                                        >
                                            <option value="Common">Common</option>
                                            <option value="Rare">Rare</option>
                                            <option value="Legendary">Legendary</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-pixel text-xs text-text-muted mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 input-retro"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block font-pixel text-xs text-text-muted mb-1">Sprite URL</label>
                                    <input
                                        type="text"
                                        name="spriteUrl"
                                        value={formData.spriteUrl}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 input-retro"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="flex-1 btn-primary" disabled={loading}>
                                        {loading ? 'SAVING...' : (editingPokemon ? 'UPDATE' : 'ADD')}
                                    </button>
                                    <button type="button" onClick={resetForm} className="flex-1 btn-secondary">
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

export default AdminPokemonManager;