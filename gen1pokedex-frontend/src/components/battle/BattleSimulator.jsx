import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { battleService } from '../../services/battleService';
import LoadingSpinner from '../common/LoadingSpinner';
import PixelButton from '../common/PixelButton';
import soundService from '../../services/soundService';

/**
 * Battle Simulator - Pokemon battle with HP bars, power animations, and winner announcement
 * Features: Health bars that decrease, power move animations, winner celebration
 * BACKGROUND: Arena (battle themed) - different from other pages
 */
const BattleSimulator = () => {
    const { user, refreshProfile } = useAuth();
    const [collection, setCollection] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPokemon1, setSelectedPokemon1] = useState(null);
    const [selectedPokemon2, setSelectedPokemon2] = useState(null);
    const [battleResult, setBattleResult] = useState(null);
    const [battling, setBattling] = useState(false);
    const [battlePhase, setBattlePhase] = useState('select');
    const [attackAnimation, setAttackAnimation] = useState(null);
    const [error, setError] = useState(null);
    const [showWinner, setShowWinner] = useState(false);
    const [winnerCelebration, setWinnerCelebration] = useState(null);
    const [p1Health, setP1Health] = useState(100);
    const [p2Health, setP2Health] = useState(100);
    const [battleLog, setBattleLog] = useState([]);
    const [currentMove, setCurrentMove] = useState(null);
    const audioContextRef = useRef(null);

    useEffect(() => {
        loadCollection();
    }, [user]);

    const loadCollection = async () => {
        try {
            setLoading(true);
            const data = await userService.getCollection(user?.username);
            setCollection(data);
        } catch (err) {
            setError('Failed to load your Pokemon collection');
        } finally {
            setLoading(false);
        }
    };

    const playClashSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        gain.gain.value = 0.3;

        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.value = 150;
        osc2.frequency.value = 200;
        osc1.connect(gain);
        osc2.connect(gain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.2);
        osc2.stop(now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
    };

    const playPowerMoveSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        gain.gain.value = 0.4;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 440;
        osc.connect(gain);
        osc.start(now);

        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
        osc.stop(now + 0.3);
    };

    const handleBattle = async () => {
        if (!selectedPokemon1 || !selectedPokemon2) {
            setError('Please select two Pokemon to battle');
            return;
        }
        if (selectedPokemon1.id === selectedPokemon2.id) {
            setError('A Pokemon cannot battle itself!');
            return;
        }

        setBattlePhase('battling');
        setError(null);
        setBattling(true);
        setBattleLog([]);
        setP1Health(100);
        setP2Health(100);
        setCurrentMove(null);
        soundService.playClickSound();

        await simulateBattleAnimation();

        try {
            const result = await battleService.simulateBattle(selectedPokemon1.id, selectedPokemon2.id);
            setBattleResult(result);
            setBattlePhase('result');

            if (result.battleLog) {
                setBattleLog(result.battleLog.split('\n').filter(line => line.trim()));
            }

            if (result.xpGained > 0) {
                soundService.playWinSound();
                if (result.newLevel > 0) {
                    soundService.playLevelUpSound();
                }
            }

            await refreshProfile();
            await loadCollection();

            setWinnerCelebration(result.winner);
            setShowWinner(true);

            setTimeout(() => {
                setShowWinner(false);
            }, 4000);

        } catch (err) {
            setError(err.response?.data?.message || 'Battle failed. Please try again.');
            setBattlePhase('select');
        } finally {
            setBattling(false);
        }
    };

    const simulateBattleAnimation = async () => {
        const powerMoves = ['💥 THUNDERBOLT!', '🔥 FLAMETHROWER!', '💧 HYDRO PUMP!', '🌱 SOLAR BEAM!', '⚡ QUICK ATTACK!'];

        for (let i = 0; i < 4; i++) {
            const randomMove = powerMoves[Math.floor(Math.random() * powerMoves.length)];
            setCurrentMove(randomMove);

            setAttackAnimation('left');
            soundService.playAttackSound();
            setP2Health(prev => Math.max(0, prev - 15));
            await new Promise(r => setTimeout(r, 400));

            setAttackAnimation('right');
            playClashSound();
            playPowerMoveSound();
            setP1Health(prev => Math.max(0, prev - 10));
            await new Promise(r => setTimeout(r, 400));
        }
        setAttackAnimation(null);
        setCurrentMove(null);
    };

    const resetBattle = () => {
        setSelectedPokemon1(null);
        setSelectedPokemon2(null);
        setBattleResult(null);
        setBattlePhase('select');
        setError(null);
        setShowWinner(false);
        setWinnerCelebration(null);
        setBattleLog([]);
        soundService.playClickSound();
    };

    const getSprite = (pokemon) => {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.pokedexNumber}.gif`;
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen p-6 relative overflow-auto">
            {/* ARENA Background - Only for battle page */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/Arena.png"
                    alt="Battle Arena"
                    className="w-full h-full object-cover brightness-75"
                    onError={(e) => {
                        console.error('arena.png not found, using fallback');
                        e.target.src = "https://archives.bulbagarden.net/w/images/thumb/4/40/Battle_Emerald_Stadium.png/1588px-Battle_Emerald_Stadium.png";
                    }}
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Subtle battle particles (embers/dust) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {[...Array(25)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${2 + Math.random() * 4}s`,
                            opacity: 0.2
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto max-w-5xl relative z-10">

                <div className="text-center mb-6">
                    <h1 className="font-pixel text-2xl md:text-3xl text-retro-green mb-2 drop-shadow-lg">⚔️ BATTLE SIMULATOR ⚔️</h1>
                    <p className="font-retro text-lg text-retro-gold drop-shadow">Train your Pokemon by battling!</p>
                    <p className="font-pixel text-xs text-gray-300 mt-2 drop-shadow">✨ Winner gains 20 XP! (100 XP = 1 Level) ✨</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-pixel-red/20 border-2 border-pixel-red rounded-lg text-center">
                        <p className="font-pixel text-xs text-pixel-red">{error}</p>
                    </div>
                )}

                {battlePhase === 'select' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Pokemon 1 Selector */}
                            <div className="bg-black/70 backdrop-blur-sm pixel-border p-4 rounded-xl">
                                <h2 className="font-pixel text-sm text-retro-green text-center mb-3">YOUR POKEMON</h2>
                                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                                    {collection.map((pokemon) => (
                                        <div
                                            key={pokemon.id}
                                            onClick={() => setSelectedPokemon1(pokemon)}
                                            className={`p-2 text-center cursor-pointer transition-all rounded-lg ${selectedPokemon1?.id === pokemon.id
                                                ? 'ring-2 ring-retro-green bg-retro-green/20'
                                                : 'hover:bg-white/10'
                                                }`}
                                        >
                                            <img src={getSprite(pokemon)} alt={pokemon.name} className="w-16 h-16 mx-auto pixelated" />
                                            <p className="font-pixel text-[10px] text-white mt-1">{pokemon.name}</p>
                                        </div>
                                    ))}
                                </div>
                                {selectedPokemon1 && (
                                    <div className="mt-3 p-2 bg-retro-green/20 rounded-lg text-center">
                                        <p className="font-pixel text-xs text-retro-green">SELECTED: {selectedPokemon1.name}</p>
                                    </div>
                                )}
                            </div>

                            {/* Pokemon 2 Selector */}
                            <div className="bg-black/70 backdrop-blur-sm pixel-border p-4 rounded-xl">
                                <h2 className="font-pixel text-sm text-retro-green text-center mb-3">OPPONENT</h2>
                                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                                    {collection.map((pokemon) => (
                                        <div
                                            key={pokemon.id}
                                            onClick={() => setSelectedPokemon2(pokemon)}
                                            className={`p-2 text-center cursor-pointer transition-all rounded-lg ${selectedPokemon2?.id === pokemon.id
                                                ? 'ring-2 ring-retro-green bg-retro-green/20'
                                                : 'hover:bg-white/10'
                                                }`}
                                        >
                                            <img src={getSprite(pokemon)} alt={pokemon.name} className="w-16 h-16 mx-auto pixelated" />
                                            <p className="font-pixel text-[10px] text-white mt-1">{pokemon.name}</p>
                                        </div>
                                    ))}
                                </div>
                                {selectedPokemon2 && (
                                    <div className="mt-3 p-2 bg-retro-green/20 rounded-lg text-center">
                                        <p className="font-pixel text-xs text-retro-green">SELECTED: {selectedPokemon2.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <PixelButton
                                onClick={handleBattle}
                                disabled={battling || !selectedPokemon1 || !selectedPokemon2}
                                variant="primary"
                                className="px-8 py-3"
                            >
                                {battling ? '⚔️ BATTLING...' : '🔥 START BATTLE!'}
                            </PixelButton>
                        </div>
                    </>
                )}

                {battlePhase === 'battling' && (
                    <div className="bg-black/70 backdrop-blur-sm pixel-border p-8 text-center rounded-xl">
                        {/* Health Bars */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-left">
                                <p className="font-pixel text-xs text-retro-green">{selectedPokemon1?.name}</p>
                                <div className="w-full bg-gray-800 h-3 mt-1 rounded-full overflow-hidden">
                                    <div
                                        className="bg-retro-green h-3 transition-all duration-300 rounded-full"
                                        style={{ width: `${p1Health}%` }}
                                    ></div>
                                </div>
                                <p className="font-pixel text-[8px] text-gray-400 mt-1">HP: {Math.floor(p1Health)}%</p>
                            </div>
                            <div className="text-right">
                                <p className="font-pixel text-xs text-retro-green">{selectedPokemon2?.name}</p>
                                <div className="w-full bg-gray-800 h-3 mt-1 rounded-full overflow-hidden">
                                    <div
                                        className="bg-pixel-red h-3 transition-all duration-300 rounded-full"
                                        style={{ width: `${p2Health}%` }}
                                    ></div>
                                </div>
                                <p className="font-pixel text-[8px] text-gray-400 mt-1">HP: {Math.floor(p2Health)}%</p>
                            </div>
                        </div>

                        {/* Power Move Display */}
                        {currentMove && (
                            <div className="mb-4 p-2 bg-retro-gold/20 rounded-lg animate-pulse">
                                <p className="font-pixel text-sm text-retro-gold">{currentMove}</p>
                            </div>
                        )}

                        {/* VS Arena with clash animation */}
                        <div className="grid grid-cols-3 items-center gap-4 mb-8">
                            <div className={`text-center transition-all duration-100 ${attackAnimation === 'left' ? 'animate-battle-shake' : ''}`}>
                                <img src={getSprite(selectedPokemon1)} alt={selectedPokemon1.name} className="w-28 h-28 mx-auto pixelated" />
                                <p className="font-pixel text-sm text-white mt-2">{selectedPokemon1.name}</p>
                            </div>
                            <div className="relative">
                                <span className="font-pixel text-5xl text-pixel-red animate-pulse">VS</span>
                                {attackAnimation && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl animate-ping">⚡</span>
                                    </div>
                                )}
                                <p className="font-retro text-xs text-retro-gold mt-2">Battling...</p>
                            </div>
                            <div className={`text-center transition-all duration-100 ${attackAnimation === 'right' ? 'animate-battle-shake' : ''}`}>
                                <img src={getSprite(selectedPokemon2)} alt={selectedPokemon2.name} className="w-28 h-28 mx-auto pixelated" />
                                <p className="font-pixel text-sm text-white mt-2">{selectedPokemon2.name}</p>
                            </div>
                        </div>
                    </div>
                )}

                {battlePhase === 'result' && battleResult && (
                    <>
                        {/* Winner Celebration */}
                        {showWinner && winnerCelebration && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in">
                                <div className="text-center">
                                    <div className="mb-6">
                                        <img
                                            src={getSprite(selectedPokemon1?.id === battleResult.winnerId ? selectedPokemon1 : selectedPokemon2)}
                                            alt={winnerCelebration}
                                            className="w-48 h-48 mx-auto pixelated animate-float"
                                        />
                                    </div>
                                    <h2 className="font-pixel text-4xl text-retro-gold mb-3 animate-bounce">WINNER!</h2>
                                    <p className="font-retro text-3xl text-white mb-4">
                                        {winnerCelebration} wins the battle!
                                    </p>
                                    {battleResult.xpGained > 0 && (
                                        <div className="bg-retro-green/20 rounded-lg p-4">
                                            <p className="font-pixel text-lg text-retro-green">✨ +{battleResult.xpGained} XP ✨</p>
                                            {battleResult.newLevel > 0 && (
                                                <p className="font-pixel text-md text-retro-gold mt-2">🎉 LEVEL UP! Now Level {battleResult.newLevel}! 🎉</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Battle Results Summary */}
                        {!showWinner && (
                            <div className="bg-black/70 backdrop-blur-sm pixel-border p-6 rounded-xl">
                                <div className="grid grid-cols-3 items-center text-center mb-6">
                                    <div>
                                        <img src={getSprite(selectedPokemon1)} alt={selectedPokemon1.name} className="w-20 h-20 mx-auto pixelated" />
                                        <p className="font-pixel text-sm text-white mt-2">{selectedPokemon1.name}</p>
                                    </div>
                                    <div>
                                        <span className="font-pixel text-2xl text-pixel-red">VS</span>
                                    </div>
                                    <div>
                                        <img src={getSprite(selectedPokemon2)} alt={selectedPokemon2.name} className="w-20 h-20 mx-auto pixelated" />
                                        <p className="font-pixel text-sm text-white mt-2">{selectedPokemon2.name}</p>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <div className="inline-block bg-retro-gold/20 rounded-lg px-6 py-3">
                                        <span className="font-pixel text-lg text-retro-gold">WINNER!</span>
                                        <p className="font-retro text-2xl text-retro-gold mt-1">{battleResult.winner} wins the battle!</p>
                                    </div>
                                </div>

                                <div className="bg-black/50 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
                                    {battleLog.map((line, idx) => (
                                        <p key={idx} className="font-retro text-xs text-retro-gold whitespace-pre-wrap">
                                            {line}
                                        </p>
                                    ))}
                                </div>

                                {battleResult.xpGained > 0 && (
                                    <div className="text-center mb-6 p-3 bg-retro-green/20 rounded-lg">
                                        <p className="font-pixel text-sm text-retro-green">✨ {battleResult.winner} gained {battleResult.xpGained} XP! ✨</p>
                                        {battleResult.newLevel > 0 && (
                                            <p className="font-pixel text-sm text-retro-gold mt-1">🎉 LEVEL UP! Now Level {battleResult.newLevel}! 🎉</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-4 justify-center">
                                    <button onClick={resetBattle} className="btn-secondary">
                                        BATTLE AGAIN
                                    </button>
                                    <Link to={`/collection/${user?.username}`}>
                                        <button className="btn-primary">VIEW MY POKEMON</button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {collection.length < 2 && (
                    <div className="mt-8 p-4 bg-retro-gold/20 rounded-lg text-center">
                        <p className="font-pixel text-sm text-retro-gold">⚠️ You need at least 2 Pokemon to battle! Go catch more Pokemon! ⚠️</p>
                        <Link to="/pokedex">
                            <button className="mt-3 btn-primary">CATCH POKEMON</button>
                        </Link>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out;
                }
                @keyframes battle-shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px) rotate(-2deg); }
                    75% { transform: translateX(10px) rotate(2deg); }
                }
                .animate-battle-shake {
                    animation: battle-shake 0.15s linear infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: float 2s ease-in-out infinite;
                }
                @keyframes float-particle {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
                    50% { transform: translateY(-30px) translateX(15px); opacity: 0.3; }
                }
                .animate-float-particle {
                    animation: float-particle 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default BattleSimulator;