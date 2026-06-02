import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import LoadingSpinner from '../common/LoadingSpinner';
import PixelButton from '../common/PixelButton';
import soundService from '../../services/soundService';

/**
 * User Collection Page - Shows all Pokemon caught by the user
 * Features: Level badges, XP bars, release button, image fallbacks
 */
const UserCollection = () => {
    const { username } = useParams();
    const { user, refreshProfile } = useAuth();
    const [collection, setCollection] = useState([]);
    const [pokemonLevels, setPokemonLevels] = useState({});
    const [loading, setLoading] = useState(true);
    const [releasing, setReleasing] = useState(null);
    const [message, setMessage] = useState(null);
    const [imgErrors, setImgErrors] = useState({});

    const isOwnProfile = user?.username === username;

    useEffect(() => {
        loadCollection();
    }, [username]);

    const loadCollection = async () => {
        try {
            setLoading(true);
            // Fetch user's caught Pokemon from backend
            const data = await userService.getCollection(username);
            setCollection(data);

            // Fetch XP/level data for each caught Pokemon
            const levelsMap = {};
            for (const pokemon of data) {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/${username}/pokemon/${pokemon.id}/level`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (response.ok) {
                        const levelData = await response.json();
                        levelsMap[pokemon.id] = {
                            level: levelData.level ?? 1,
                            experience: levelData.experience ?? 0
                        };
                    } else {
                        levelsMap[pokemon.id] = { level: 1, experience: 0 };
                    }
                } catch (err) {
                    levelsMap[pokemon.id] = { level: 1, experience: 0 };
                }
            }
            setPokemonLevels(levelsMap);
        } catch (err) {
            setMessage('Failed to load collection');
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleRelease = async (pokemonId, pokemonName) => {
        // Confirm before permanently removing Pokemon from collection
        if (!window.confirm(`Release ${pokemonName}? This action cannot be undone!`)) {
            return;
        }

        try {
            setReleasing(pokemonId);
            await userService.releasePokemon(username, pokemonId);
            await refreshProfile();
            await loadCollection();
            soundService.playClickSound();
            setMessage(`✨ ${pokemonName} was released ✨`);
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage(`Failed to release ${pokemonName}`);
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setReleasing(null);
        }
    };

    const getSpriteUrl = (pokemon) => {
        if (imgErrors[pokemon.id]) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber}.png`;
        }
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.pokedexNumber}.gif`;
    };

    const handleImageError = (pokemonId) => {
        setImgErrors(prev => ({ ...prev, [pokemonId]: true }));
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="min-h-screen p-6 relative">
            {/* Dark background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]"></div>

            {/* Subtle pattern */}
            <div className="absolute inset-0 z-0 opacity-5">
                <div className="w-full h-full bg-repeat" style={{ backgroundImage: 'radial-gradient(#4ade80 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-pixel text-2xl md:text-3xl text-retro-green mb-2">
                        {username}'s POKEMON
                    </h1>
                    <p className="font-retro text-lg text-retro-gold">Caught: {collection.length} / 151</p>
                    <div className="progress-bar w-64 mx-auto mt-3">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${(collection.length / 151) * 100}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-center gap-1 mt-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-4 h-1 bg-retro-green"></div>
                        ))}
                    </div>
                </div>

                {/* Message Alert */}
                {message && (
                    <div className="mb-6 p-3 bg-retro-green/20 border-2 border-retro-green text-center rounded-lg">
                        <p className="font-pixel text-xs text-retro-green">{message}</p>
                    </div>
                )}

                {/* Empty State */}
                {collection.length === 0 && (
                    <div className="text-center py-12 bg-black/50 pixel-border rounded-xl">
                        <p className="font-pixel text-gray-400 mb-4">No Pokemon caught yet!</p>
                        <Link to="/pokedex">
                            <PixelButton variant="primary">GO CATCH SOME POKEMON</PixelButton>
                        </Link>
                    </div>
                )}

                {/* Pokemon Collection Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {collection.map((pokemon) => {
                        const levelData = pokemonLevels[pokemon.id] || { level: 1, experience: 0 };
                        const xpPercentage = levelData.experience || 0;

                        return (
                            <div key={pokemon.id} className="bg-black/70 pixel-border p-3 relative group transition-all duration-300 hover:scale-105 rounded-xl">
                                {/* Level Badge */}
                                <div className="absolute top-2 left-2 bg-retro-green/90 px-2 py-0.5 z-10 rounded">
                                    <span className="font-pixel text-[8px] text-black">Lv.{levelData.level}</span>
                                </div>

                                {/* Release Button (only for own profile) */}
                                {isOwnProfile && (
                                    <button
                                        onClick={() => handleRelease(pokemon.id, pokemon.name)}
                                        disabled={releasing === pokemon.id}
                                        className="absolute top-2 right-2 w-6 h-6 bg-pixel-red/80 hover:bg-pixel-red text-white font-bold z-10 rounded-full disabled:opacity-50 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}

                                {/* Pokemon Sprite */}
                                <Link to={`/pokemon/${pokemon.id}`}>
                                    <div className="text-center">
                                        <img
                                            src={getSpriteUrl(pokemon)}
                                            alt={pokemon.name}
                                            className="w-24 h-24 mx-auto pixelated hover:scale-110 transition-transform duration-300"
                                            onError={() => handleImageError(pokemon.id)}
                                        />
                                        <p className="font-pixel text-xs text-retro-green mt-2">
                                            #{String(pokemon.pokedexNumber).padStart(3, '0')}
                                        </p>
                                        <p className="font-pixel text-sm text-retro-gold">{pokemon.name}</p>

                                        {/* XP Bar */}
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-retro-green h-1.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${xpPercentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="font-pixel text-[6px] text-gray-500 mt-0.5">
                                                XP: {levelData.experience || 0}/100
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="font-pixel text-[8px] text-gray-500">
                        Click on any Pokemon to view details
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserCollection;