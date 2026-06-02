import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { pokemonService } from '../../services/pokemonService';
import LoadingSpinner from '../common/LoadingSpinner';
import PixelButton from '../common/PixelButton';
import soundService from '../../services/soundService';

/**
 * User Dashboard - Main hub for trainers
 * Features: Interactive stats cards, daily challenge, random Pokemon, badges
 */
const UserDashboard = () => {
    const { user, userProfile, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [dailyChallenge, setDailyChallenge] = useState(null);
    const [streak, setStreak] = useState(0);
    const [randomPokemon, setRandomPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const [claimMessage, setClaimMessage] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            // Load daily challenge, streak, and random Pokemon suggestion
            const [challenge, streakData, random] = await Promise.all([
                userService.getTodayChallenge(),
                userService.getStreak(user?.username),
                pokemonService.getRandom()
            ]);
            setDailyChallenge(challenge);
            setStreak(streakData);
            setRandomPokemon(random);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClaimChallenge = async () => {
        try {
            setClaiming(true);
            const result = await userService.claimChallenge(user?.username);
            setClaimMessage(result);
            setShowConfetti(true);
            await refreshProfile();
            await loadDashboardData();
            soundService.playCatchSound();
            setTimeout(() => setShowConfetti(false), 3000);
            setTimeout(() => setClaimMessage(null), 5000);
        } catch (err) {
            setClaimMessage(err.response?.data || 'Failed to claim challenge');
            setTimeout(() => setClaimMessage(null), 3000);
        } finally {
            setClaiming(false);
        }
    };

    const handleNavigate = (path) => {
        soundService.playClickSound();
        navigate(path);
    };

    if (loading) return <LoadingSpinner fullScreen />;

    const completionPercentage = userProfile?.completionPercentage || 0;
    const caughtCount = userProfile?.pokemonCount || 0;

    return (
        <div className="min-h-screen p-6 relative overflow-hidden">
            {/* Dark background for readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]"></div>

            {/* Subtle Pokemon pattern */}
            <div className="absolute inset-0 z-0 opacity-5">
                <div className="w-full h-full bg-repeat" style={{ backgroundImage: 'radial-gradient(#4ade80 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            {/* Confetti effect */}
            {showConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-retro-gold animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="container mx-auto max-w-6xl relative z-10">

                {/* Welcome Header */}
                <div className="text-center mb-8">
                    <h1 className="font-pixel text-2xl md:text-3xl text-retro-green mb-2 animate-pulse">
                        ⚡ WELCOME BACK, {user?.username?.toUpperCase()}! ⚡
                    </h1>
                    <div className="flex justify-center gap-1 mt-2">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-4 h-1 bg-retro-green animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                    </div>
                    <p className="font-retro text-sm text-gray-400 mt-2">Continue your journey to become a Pokemon Master!</p>
                </div>

                {/* Stats Grid - Interactive Cards with SAME animation as admin */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* Pokedex Card - Click to view Pokedex */}
                    <div
                        onClick={() => handleNavigate('/pokedex')}
                        className="bg-black/70 pixel-border p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="text-4xl mb-3 group-hover:animate-bounce">📖</div>
                        <h3 className="font-pixel text-sm text-retro-green mb-2">POKEDEX</h3>
                        <p className="font-retro text-3xl text-retro-gold">{caughtCount}/151</p>
                        <div className="progress-bar mt-3">
                            <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }}></div>
                        </div>
                        <p className="font-pixel text-xs text-gray-400 mt-2">{completionPercentage.toFixed(1)}% COMPLETE</p>
                        <p className="font-pixel text-[8px] text-retro-green mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to explore →</p>
                    </div>

                    {/* Daily Challenge Card - Click to claim */}
                    <div
                        onClick={!claiming && dailyChallenge ? handleClaimChallenge : undefined}
                        className={`bg-black/70 pixel-border p-6 text-center transition-all duration-300 ${!claiming && dailyChallenge ? 'hover:scale-105 cursor-pointer group' : 'opacity-75'}`}
                    >
                        <div className="text-4xl mb-3 group-hover:animate-spin">⭐</div>
                        <h3 className="font-pixel text-sm text-retro-green mb-2">DAILY CHALLENGE</h3>
                        {dailyChallenge ? (
                            <>
                                <img
                                    src={dailyChallenge.spriteUrl}
                                    alt={dailyChallenge.pokemonName}
                                    className="w-16 h-16 mx-auto pixelated mb-2 animate-float"
                                    onError={(e) => { e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png`; }}
                                />
                                <p className="font-retro text-lg text-retro-gold">{dailyChallenge.pokemonName}</p>
                                <p className="font-pixel text-xs text-gray-400 mt-2">🔥 Streak: {streak} days</p>
                                <div className="mt-3 inline-block px-3 py-1 bg-retro-green/20 rounded-full">
                                    <p className="font-pixel text-[8px] text-retro-green">{claiming ? 'CLAIMING...' : '🎁 Click to claim reward'}</p>
                                </div>
                            </>
                        ) : (
                            <p className="font-pixel text-xs text-gray-400">Check back tomorrow!</p>
                        )}
                    </div>

                    {/* Random Pokemon Card - Click to view details */}
                    <div
                        onClick={() => randomPokemon && handleNavigate(`/pokemon/${randomPokemon.id}`)}
                        className="bg-black/70 pixel-border p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="text-4xl mb-3 group-hover:animate-pulse">🎲</div>
                        <h3 className="font-pixel text-sm text-retro-green mb-2">RANDOM POKEMON</h3>
                        {randomPokemon && (
                            <>
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${randomPokemon.pokedexNumber}.gif`}
                                    alt={randomPokemon.name}
                                    className="w-16 h-16 mx-auto pixelated mb-2 animate-float"
                                    onError={(e) => { e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomPokemon.pokedexNumber}.png`; }}
                                />
                                <p className="font-retro text-lg text-retro-gold">{randomPokemon.name}</p>
                                <p className="font-pixel text-[8px] text-retro-green mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Claim Message */}
                {claimMessage && (
                    <div className={`mb-6 p-4 text-center font-pixel text-sm animate-bounce ${claimMessage.includes('Congratulations') ? 'bg-retro-green/20 border-2 border-retro-green text-retro-green' : 'bg-pixel-red/20 border-2 border-pixel-red text-pixel-red'
                        }`}>
                        {typeof claimMessage === 'string' ? claimMessage : claimMessage.message}
                    </div>
                )}

                {/* Quick Actions - No duplicates */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Link to="/pokedex" onClick={() => soundService.playClickSound()}>
                        <div className="bg-black/50 pixel-border p-4 text-center hover:bg-retro-green/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="text-2xl mb-2">🔍</div>
                            <p className="font-pixel text-xs text-retro-green">BROWSE POKEDEX</p>
                        </div>
                    </Link>
                    <Link to={`/collection/${user?.username}`} onClick={() => soundService.playClickSound()}>
                        <div className="bg-black/50 pixel-border p-4 text-center hover:bg-retro-green/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="text-2xl mb-2">🎒</div>
                            <p className="font-pixel text-xs text-retro-green">MY COLLECTION</p>
                        </div>
                    </Link>
                    <Link to="/battle" onClick={() => soundService.playClickSound()}>
                        <div className="bg-black/50 pixel-border p-4 text-center hover:bg-retro-green/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="text-2xl mb-2">⚔️</div>
                            <p className="font-pixel text-xs text-retro-green">TRAIN BATTLE</p>
                        </div>
                    </Link>
                    <Link to="/leaderboard" onClick={() => soundService.playClickSound()}>
                        <div className="bg-black/50 pixel-border p-4 text-center hover:bg-retro-green/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="text-2xl mb-2">🏆</div>
                            <p className="font-pixel text-xs text-retro-green">LEADERBOARD</p>
                        </div>
                    </Link>
                </div>

                {/* Badges Section */}
                <div className="bg-black/70 pixel-border p-6">
                    <h2 className="font-pixel text-lg text-retro-green mb-4 text-center animate-pulse">🏆 EARNED BADGES</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {userProfile?.badges?.length > 0 ? (
                            userProfile.badges.map((badge, idx) => (
                                <div key={badge.id} className="text-center group cursor-pointer animate-float" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="w-16 h-16 bg-retro-gold/20 pixel-border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform group-hover:bg-retro-gold/40">
                                        {badge.iconUrl || '🏅'}
                                    </div>
                                    <p className="font-pixel text-[8px] text-retro-gold mt-1">{badge.name}</p>
                                </div>
                            ))
                        ) : (
                            <p className="font-pixel text-xs text-gray-400 text-center">No badges yet. Keep catching Pokemon!</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="font-retro text-xs text-gray-500 animate-pulse">✨ Keep exploring to complete your Pokedex! ✨</p>
                </div>
            </div>

            <style>{`
                @keyframes confetti {
                    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti 3s ease-out forwards;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .group-hover\\:animate-spin:hover {
                    animation: spin 0.5s linear;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;