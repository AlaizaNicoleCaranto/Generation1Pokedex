import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelButton from '../common/PixelButton';
import soundService from '../../services/soundService';

// Landing page - Zoomed Kanto map background with visible roaming Pokemon
const LandingPage = () => {
    const navigate = useNavigate();

    // Start background music when landing page loads
    useEffect(() => {
        soundService.startLandingMusic();

        // Cleanup on unmount
        return () => {
            // Don't stop music here - it continues to dashboard
        };
    }, []);

    const starters = [
        { id: 1, name: 'Bulbasaur', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif' },
        { id: 4, name: 'Charmander', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif' },
        { id: 7, name: 'Squirtle', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif' },
        { id: 25, name: 'Pikachu', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' },
    ];

    // Roaming Pokemon - larger and more visible
    const roamingPokemon = [
        { id: 16, name: 'Pidgey', x: 12, y: 20, delay: 0, duration: 7 },
        { id: 19, name: 'Rattata', x: 78, y: 25, delay: 0.5, duration: 8 },
        { id: 41, name: 'Zubat', x: 88, y: 60, delay: 1, duration: 6 },
        { id: 43, name: 'Oddish', x: 22, y: 75, delay: 0.3, duration: 9 },
        { id: 74, name: 'Geodude', x: 55, y: 42, delay: 0.8, duration: 7 },
        { id: 133, name: 'Eevee', x: 42, y: 12, delay: 0.6, duration: 8 },
        { id: 54, name: 'Psyduck', x: 8, y: 55, delay: 1.2, duration: 6 },
        { id: 39, name: 'Jigglypuff', x: 92, y: 18, delay: 0.4, duration: 7 },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

            {/* Kanto Map Background */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full animate-slow-zoom">
                    <img
                        src="https://archives.bulbagarden.net/media/upload/7/7d/PE_Kanto_Map.png"
                        alt="Kanto Region Map"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-black/45"></div>
            </div>

            {/* Roaming Pokemon - larger, more visible */}
            <div className="absolute inset-0 z-5 pointer-events-none">
                {roamingPokemon.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className="absolute animate-float-wild"
                        style={{
                            left: `${pokemon.x}%`,
                            top: `${pokemon.y}%`,
                            animationDelay: `${pokemon.delay}s`,
                            animationDuration: `${pokemon.duration}s`
                        }}
                    >
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`}
                            alt={pokemon.name}
                            className="w-12 h-12 md:w-14 md:h-14 pixelated opacity-70 hover:opacity-100 hover:scale-125 transition-all pointer-events-auto cursor-pointer"
                        />
                        {/* Name label on hover */}
                        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 font-pixel text-[6px] text-retro-gold bg-black/60 px-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                            {pokemon.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-300 opacity-30 animate-ping"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${2 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 text-center max-w-2xl w-full mx-auto">

                <div className="bg-black/35 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/10 shadow-xl">

                    <h1 className="font-pixel text-3xl md:text-4xl text-retro-green mb-1 drop-shadow-lg">GENERATION 1</h1>
                    <h2 className="font-pixel text-4xl md:text-5xl text-retro-gold mb-3 animate-pulse drop-shadow-lg">POKÉDEX</h2>

                    <p className="font-retro text-base md:text-lg text-white mb-6 drop-shadow">"Gotta Catch 'Em All!"</p>

                    <div className="flex justify-center gap-2 mb-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-2 h-1 bg-retro-green/70"></div>
                        ))}
                    </div>

                    {/* Starter Pokemon */}
                    <div className="mb-6">
                        <div className="flex justify-center gap-4 md:gap-6">
                            {starters.map((starter, idx) => (
                                <div key={starter.id} className="text-center group">
                                    <img
                                        src={starter.sprite}
                                        alt={starter.name}
                                        className="w-16 h-16 md:w-20 md:h-20 pixelated hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                                        style={{ animation: `float ${2 + idx * 0.3}s ease-in-out infinite` }}
                                    />
                                    <p className="font-pixel text-[8px] text-retro-green mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {starter.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div className="bg-black/30 rounded p-4 mb-6">
                        <p className="font-pixel text-xs text-white">Welcome to the World of Pokemon!</p>
                        <p className="font-retro text-sm text-retro-gold mt-1">Explore the Kanto region and discover all 151 Pokemon!</p>
                    </div>

                    <PixelButton onClick={() => navigate('/login')} className="px-8 py-3">
                        START YOUR JOURNEY ▶
                    </PixelButton>
                </div>

                <div className="text-center mt-4">
                    <p className="font-retro text-xs text-white/90">© 2026 CALM GROUP | Kanto Region</p>
                </div>
            </div>

            <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite;
        }
        @keyframes float-wild {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(8px); }
          50% { transform: translateY(0px) translateX(15px); }
          75% { transform: translateY(10px) translateX(8px); }
        }
        .animate-float-wild {
          animation: float-wild 7s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
};

export default LandingPage;