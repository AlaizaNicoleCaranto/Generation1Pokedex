import { useEffect } from 'react';
import soundService from '../../services/soundService';

/**
 * Background for all protected pages (after login)
 * Features: Kanto map background that is VISIBLE but slightly dimmed for text readability
 * CONSISTENT across ALL protected pages (User and Admin) - EXCEPT Battle page
 */
const BackgroundWithPokemon = ({ children }) => {

    // Start background music when entering protected pages
    useEffect(() => {
        soundService.startBackgroundMusic();
        return () => { };
    }, []);

    // Subtle Pokemon silhouettes in background - like clouds floating
    const bgPokemon = [
        { id: 25, name: 'Pikachu', x: 5, y: 15, size: 'w-12 h-12', opacity: 0.1, delay: 0, duration: 25 },
        { id: 1, name: 'Bulbasaur', x: 85, y: 75, size: 'w-10 h-10', opacity: 0.08, delay: 1, duration: 28 },
        { id: 4, name: 'Charmander', x: 15, y: 80, size: 'w-10 h-10', opacity: 0.09, delay: 0.5, duration: 22 },
        { id: 7, name: 'Squirtle', x: 75, y: 20, size: 'w-10 h-10', opacity: 0.08, delay: 1.5, duration: 26 },
        { id: 6, name: 'Charizard', x: 45, y: 45, size: 'w-14 h-14', opacity: 0.07, delay: 0.8, duration: 30 },
        { id: 9, name: 'Blastoise', x: 60, y: 60, size: 'w-12 h-12', opacity: 0.07, delay: 0.3, duration: 24 },
        { id: 3, name: 'Venusaur', x: 30, y: 30, size: 'w-12 h-12', opacity: 0.07, delay: 1.2, duration: 27 },
        { id: 149, name: 'Dragonite', x: 50, y: 85, size: 'w-14 h-14', opacity: 0.06, delay: 0.6, duration: 32 },
        { id: 130, name: 'Gyarados', x: 10, y: 50, size: 'w-16 h-16', opacity: 0.06, delay: 1.8, duration: 29 },
        { id: 143, name: 'Snorlax', x: 90, y: 40, size: 'w-14 h-14', opacity: 0.07, delay: 0.2, duration: 23 },
    ];

    // Floating particles like dust/pollen
    const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 5 + Math.random() * 10,
        opacity: 0.06 + Math.random() * 0.08
    }));

    return (
        <div className="relative min-h-screen">
            {/* Kanto Map Background - VISIBLE but slightly dimmed */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/Kanto-bg.png"
                    alt="Kanto Region Background"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        console.error('Background image failed to load, using fallback');
                        e.target.src = "https://archives.bulbagarden.net/media/upload/7/7d/PE_Kanto_Map.png";
                    }}
                />
                {/* Light overlay - just enough for text readability, keeps background visible */}
                <div className="absolute inset-0 bg-black/25"></div>
            </div>

            {/* Subtle floating Pokemon silhouettes - like clouds in the sky */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {bgPokemon.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className="absolute animate-float-cloud"
                        style={{
                            left: `${pokemon.x}%`,
                            top: `${pokemon.y}%`,
                            animationDelay: `${pokemon.delay}s`,
                            animationDuration: `${pokemon.duration}s`,
                            opacity: pokemon.opacity
                        }}
                    >
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                            alt={pokemon.name}
                            className={`${pokemon.size} pixelated grayscale`}
                        />
                    </div>
                ))}
            </div>

            {/* Floating particles - like dust in the air */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute w-1 h-1 bg-retro-gold rounded-full animate-float-particle"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                            opacity: particle.opacity
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10">
                {children}
            </div>

            <style>{`
                @keyframes float-cloud {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px); 
                    }
                    25% { 
                        transform: translateY(-20px) translateX(15px); 
                    }
                    50% { 
                        transform: translateY(0px) translateX(30px); 
                    }
                    75% { 
                        transform: translateY(20px) translateX(15px); 
                    }
                }
                .animate-float-cloud {
                    animation: float-cloud 25s ease-in-out infinite;
                }
                @keyframes float-particle {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px);
                    }
                    50% { 
                        transform: translateY(-30px) translateX(20px);
                    }
                }
                .animate-float-particle {
                    animation: float-particle 10s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default BackgroundWithPokemon;