import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import soundService from '../../services/soundService';

/**
 * Pokemon Card Component - Features:
 * - Front: Pokemon sprite, name, and ID number
 * - Hover: Flips to back showing stats (HP, Attack, Defense, Habitat, Rarity)
 * - Double-click: Navigates to full details page
 * - Hover also plays Pokemon cry sound
 */
const PokemonCard = ({ pokemon }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [cryPlayed, setCryPlayed] = useState(false);
    const navigate = useNavigate();

    const formattedNumber = `#${String(pokemon.pokedexNumber).padStart(3, '0')}`;

    // Get sprite URL with fallback
    const getSpriteUrl = () => {
        if (imgError) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber}.png`;
        }
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.pokedexNumber}.gif`;
    };

    // HOVER: Flip card + play Pokemon cry
    const handleMouseEnter = () => {
        setIsFlipped(true);
        if (!cryPlayed) {
            soundService.playPokemonCry(pokemon.pokedexNumber);
            setCryPlayed(true);
        }
    };

    const handleMouseLeave = () => {
        setIsFlipped(false);
        setCryPlayed(false);
    };

    // DOUBLE CLICK: Go to details page
    const handleDoubleClick = () => {
        soundService.playClickSound();
        navigate(`/pokemon/${pokemon.id}`);
    };

    // Get type color for badge - Each Pokemon type has unique color for UI consistency
    const getTypeClass = (typeName) => {
        const typeColors = {
            'Normal': 'bg-[#A8A878]', 'Fire': 'bg-[#F08030]', 'Water': 'bg-[#6890F0]',
            'Grass': 'bg-[#78C850]', 'Electric': 'bg-[#F8D030]', 'Ice': 'bg-[#98D8D8]',
            'Fighting': 'bg-[#C03028]', 'Poison': 'bg-[#A040A0]', 'Ground': 'bg-[#E0C068]',
            'Flying': 'bg-[#A890F0]', 'Psychic': 'bg-[#F85888]', 'Bug': 'bg-[#A8B820]',
            'Rock': 'bg-[#B8A038]', 'Ghost': 'bg-[#705898]', 'Dragon': 'bg-[#7038F8]',
        };
        return typeColors[typeName] || 'bg-gray-500';
    };

    return (
        <div
            className="relative w-full aspect-[3/4] cursor-pointer perspective-1000 group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={handleDoubleClick}
        >
            <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* FRONT - Sprite, number, name, types */}
                <div className="absolute inset-0 backface-hidden">
                    <div className="w-full h-full bg-black/80 border-2 border-retro-green rounded-xl p-3 flex flex-col items-center justify-center shadow-lg">
                        {/* Pokemon Sprite/Image */}
                        <div className="w-28 h-28 flex items-center justify-center bg-black/50 rounded-xl mb-3">
                            <img
                                src={getSpriteUrl()}
                                alt={pokemon.name}
                                className="w-24 h-24 object-contain pixelated group-hover:scale-110 transition-transform duration-300"
                                loading="lazy"
                                onError={() => setImgError(true)}
                            />
                        </div>
                        {/* ID Number */}
                        <span className="font-pixel text-xs text-retro-green mb-1">{formattedNumber}</span>
                        {/* Name */}
                        <h3 className="font-pixel text-sm text-retro-gold font-bold text-center">{pokemon.name}</h3>
                        {/* Types */}
                        <div className="flex gap-1 mt-2">
                            {pokemon.types?.slice(0, 2).map((type) => (
                                <span key={type.id} className={`px-2 py-0.5 font-retro text-xs ${getTypeClass(type.name)} text-white rounded-full shadow-md`}>
                                    {type.name}
                                </span>
                            ))}
                        </div>
                        {/* Hint text */}
                        <div className="mt-2 text-center">
                            <span className="font-pixel text-[6px] text-gray-500">🖱️ Hover for cry & stats | ⏺ Double-click for details</span>
                        </div>
                    </div>
                </div>

                {/* BACK - Stats (HP, Attack, Defense, Habitat, Rarity) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="w-full h-full bg-black/90 border-2 border-retro-green rounded-xl p-3 flex flex-col shadow-lg">
                        {/* Pokemon Name on back */}
                        <h4 className="font-pixel text-sm text-retro-gold mb-3 text-center">{pokemon.name}</h4>

                        {/* HP Bar */}
                        <div className="mb-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-retro text-gray-400">❤️ HP</span>
                                <span className="font-retro text-retro-green">{pokemon.hp}</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-0.5">
                                <div className="bg-retro-green h-1.5 rounded-full" style={{ width: `${(pokemon.hp / 255) * 100}%` }}></div>
                            </div>
                        </div>

                        {/* Attack Bar */}
                        <div className="mb-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-retro text-gray-400">⚔️ ATK</span>
                                <span className="font-retro text-pixel-red">{pokemon.attack}</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-0.5">
                                <div className="bg-pixel-red h-1.5 rounded-full" style={{ width: `${(pokemon.attack / 255) * 100}%` }}></div>
                            </div>
                        </div>

                        {/* Defense Bar */}
                        <div className="mb-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-retro text-gray-400">🛡️ DEF</span>
                                <span className="font-retro text-pixel-blue">{pokemon.defense}</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-0.5">
                                <div className="bg-pixel-blue h-1.5 rounded-full" style={{ width: `${(pokemon.defense / 255) * 100}%` }}></div>
                            </div>
                        </div>

                        {/* Speed Bar */}
                        <div className="mb-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-retro text-gray-400">⚡ SPEED</span>
                                <span className="font-retro text-retro-gold">{pokemon.speed}</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-0.5">
                                <div className="bg-retro-gold h-1.5 rounded-full" style={{ width: `${(pokemon.speed / 255) * 100}%` }}></div>
                            </div>
                        </div>

                        {/* Habitat & Rarity */}
                        <div className="text-center mt-2">
                            <span className="font-pixel text-[8px] text-gray-400 block">
                                🌍 {pokemon.habitat || 'Unknown Habitat'}
                            </span>
                            <span className={`font-pixel text-[8px] mt-1 block ${pokemon.rarity === 'Legendary' ? 'text-retro-gold' :
                                    pokemon.rarity === 'Rare' ? 'text-pixel-blue' : 'text-gray-400'
                                }`}>
                                {pokemon.rarity || 'Common'}
                            </span>
                        </div>

                        {/* Hint text on back */}
                        <div className="text-center mt-2">
                            <span className="font-pixel text-[6px] text-gray-600">🔍 Double-click for full details</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonCard;