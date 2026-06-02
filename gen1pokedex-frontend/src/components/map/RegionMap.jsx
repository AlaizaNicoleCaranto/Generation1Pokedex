import { useState } from 'react';
import { Link } from 'react-router-dom';
import { pokemonService } from '../../services/pokemonService';
import LoadingSpinner from '../common/LoadingSpinner';
import PixelButton from '../common/PixelButton';
import soundService from '../../services/soundService';

/**
 * Region Map - Interactive Kanto map with Pokemon habitats
 * Features: Click locations to see Pokemon in that area, color-coded pins by habitat
 * Habitats: Grassland, Forest, Rock, Cave, Water's Edge, Mountain, Urban, Sea
 * Modal displays all Pokemon found in selected location
 */
const RegionMap = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [pokemonsInLocation, setPokemonsInLocation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Locations with custom pin colors and icons
    const locations = [
        { id: 1, name: 'Pallet Town', habitat: 'Grassland', x: 15, y: 70, pinColor: '#4ade80', pinIcon: '🏠' },
        { id: 2, name: 'Viridian Forest', habitat: 'Forest', x: 30, y: 55, pinColor: '#22c55e', pinIcon: '🌲' },
        { id: 3, name: 'Pewter City', habitat: 'Rock', x: 20, y: 40, pinColor: '#a855f7', pinIcon: '⛰️' },
        { id: 4, name: 'Mt. Moon', habitat: 'Cave', x: 40, y: 35, pinColor: '#6b7280', pinIcon: '🌙' },
        { id: 5, name: 'Cerulean City', habitat: "Water's Edge", x: 55, y: 45, pinColor: '#3b82f6', pinIcon: '💧' },
        { id: 6, name: 'Rock Tunnel', habitat: 'Cave', x: 65, y: 30, pinColor: '#6b7280', pinIcon: '🪨' },
        { id: 7, name: 'Lavender Town', habitat: 'Grassland', x: 75, y: 40, pinColor: '#4ade80', pinIcon: '🌸' },
        { id: 8, name: 'Celadon City', habitat: 'Grassland', x: 50, y: 60, pinColor: '#4ade80', pinIcon: '🏙️' },
        { id: 9, name: 'Safari Zone', habitat: 'Grassland', x: 70, y: 65, pinColor: '#4ade80', pinIcon: '🦒' },
        { id: 10, name: 'Seafoam Islands', habitat: "Water's Edge", x: 85, y: 75, pinColor: '#3b82f6', pinIcon: '❄️' },
        { id: 11, name: 'Pokemon Mansion', habitat: 'Mountain', x: 65, y: 80, pinColor: '#a855f7', pinIcon: '🏛️' },
        { id: 12, name: 'Victory Road', habitat: 'Cave', x: 50, y: 85, pinColor: '#6b7280', pinIcon: '🏆' },
        { id: 13, name: 'Indigo Plateau', habitat: 'Mountain', x: 40, y: 90, pinColor: '#a855f7', pinIcon: '👑' },
        { id: 14, name: 'Power Plant', habitat: 'Mountain', x: 80, y: 20, pinColor: '#a855f7', pinIcon: '⚡' },
    ];

    const handleLocationClick = async (location) => {
        soundService.playClickSound();
        setSelectedLocation(location);
        setLoading(true);
        setShowModal(true);
        try {
            const pokemons = await pokemonService.filterByHabitat(location.habitat);
            setPokemonsInLocation(pokemons);
        } catch (err) {
            setPokemonsInLocation([]);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        soundService.playClickSound();
        setShowModal(false);
        setSelectedLocation(null);
        setPokemonsInLocation([]);
    };

    const getSprite = (pokemon) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber}.png`;

    return (
        <div className="min-h-screen p-6 relative overflow-auto">
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-6">
                    <h1 className="font-pixel text-2xl md:text-3xl text-text-dark mb-2 drop-shadow-md">🗺️ KANTO REGION MAP 🗺️</h1>
                    <p className="font-retro text-lg text-text-muted">Click on any pin to discover Pokemon!</p>
                    <div className="flex justify-center gap-1 mt-3">{[...Array(8)].map((_, i) => (<div key={i} className="w-4 h-0.5 bg-retro-green"></div>))}</div>
                </div>

                {/* Legend - Shows pin colors */}
                <div className="flex flex-wrap justify-center gap-4 mb-6 p-3 bg-black/50 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4ade80' }}></div><span className="font-pixel text-xs text-white">Grassland</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }}></div><span className="font-pixel text-xs text-white">Forest</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#a855f7' }}></div><span className="font-pixel text-xs text-white">Mountain</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#6b7280' }}></div><span className="font-pixel text-xs text-white">Cave</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div><span className="font-pixel text-xs text-white">Water's Edge</span></div>
                </div>

                {/* Map Container - Custom pins with icons */}
                <div className="relative w-full aspect-[16/9] max-h-[720px] bg-black/50 backdrop-blur-lg rounded-3xl p-3 border border-white/20 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                        <img
                            src="https://archives.bulbagarden.net/media/upload/7/7d/PE_Kanto_Map.png"
                            alt="Kanto Map"
                            className="w-full h-full object-cover opacity-80 brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
                    </div>

                    {/* Custom Pins - Now with visible colors, icons, and tooltips */}
                    {locations.map((location) => (
                        <button
                            key={location.id}
                            onClick={() => handleLocationClick(location)}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
                            style={{ left: `${location.x}%`, top: `${location.y}%` }}
                        >
                            <div className="relative">
                                <div
                                    className="w-10 h-10 rounded-full shadow-2xl flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundColor: location.pinColor,
                                        boxShadow: `0 0 0 3px white, 0 0 0 6px ${location.pinColor}`
                                    }}
                                >
                                    <span className="text-base drop-shadow-lg">{location.pinIcon}</span>
                                </div>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/90 px-3 py-1 rounded-full pointer-events-none ring-1 ring-white/10">
                                    <span className="font-pixel text-[9px] text-white">{location.name}</span>
                                    <span className="font-retro text-[7px] text-gray-300 ml-1">({location.habitat})</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-black/50 backdrop-blur-sm rounded-lg text-center">
                    <p className="font-pixel text-[8px] text-white">💡 Tip: Hover over pins to see location names, click to discover Pokemon!</p>
                </div>

                {/* Location Modal */}
                {showModal && selectedLocation && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                        <div className="bg-black/90 backdrop-blur-sm rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-retro-green/20 p-4 border-b border-white/20">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-pixel text-lg text-retro-green">{selectedLocation.name}</h2>
                                    <button onClick={closeModal} className="text-pixel-red font-pixel text-xl hover:text-red-500">✕</button>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedLocation.pinColor }}></div>
                                    <p className="font-retro text-sm text-white">Habitat: {selectedLocation.habitat}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                {loading ? (<div className="text-center py-8"><LoadingSpinner /></div>) : pokemonsInLocation.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        {pokemonsInLocation.slice(0, 20).map((pokemon) => (
                                            <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`} onClick={closeModal} className="text-center p-2 hover:bg-white/10 transition-colors rounded-lg">
                                                <img
                                                    src={getSprite(pokemon)}
                                                    alt={pokemon.name}
                                                    className="w-16 h-16 mx-auto pixelated hover:scale-110 transition-transform"
                                                    onError={(e) => { e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png`; }}
                                                />
                                                <p className="font-pixel text-[8px] text-white mt-1">{pokemon.name}</p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (<div className="text-center py-8"><p className="font-pixel text-sm text-white">No Pokemon found in this area yet.</p></div>)}
                            </div>
                            <div className="bg-white/5 p-3 text-center border-t border-white/10">
                                <p className="font-pixel text-[8px] text-gray-400">Click on any Pokemon to view details!</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center mt-6">
                    <Link to="/pokedex">
                        <PixelButton variant="secondary">← BACK TO POKEDEX</PixelButton>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegionMap;