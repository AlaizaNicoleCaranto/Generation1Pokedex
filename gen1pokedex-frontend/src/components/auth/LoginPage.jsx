import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PixelButton from '../common/PixelButton';
import LoadingSpinner from '../common/LoadingSpinner';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [errorType, setErrorType] = useState(null); // 'banned', 'suspended', or null
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const errorParam = new URLSearchParams(location.search).get('error');

    useEffect(() => {
        if (errorParam === 'account_blocked') {
            setError('Your account has been blocked. Please contact support.');
            setErrorType('banned');
        }
    }, [errorParam]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrorType(null);
        setLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            const errorData = err.response?.data;
            const backendErrorType = errorData?.error_type;
            const message = errorData?.message;

            // Check backend error_type field for specific status
            if (backendErrorType === 'USER_BANNED') {
                setError('❌ Your account has been PERMANENTLY BANNED. Contact an administrator for details.');
                setErrorType('banned');
            } else if (backendErrorType === 'USER_SUSPENDED') {
                setError('⏸️  Your account has been TEMPORARILY SUSPENDED. Contact an administrator for details.');
                setErrorType('suspended');
            } else if (message?.includes('not found')) {
                setError('⚠️ Invalid username or password. Please try again.');
                setErrorType(null);
            } else {
                setError('⚠️ Login failed. ' + (message || 'Please try again.'));
                setErrorType(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Corner Pokemon
    const cornerPokemon = [
        { id: 25, name: 'Pikachu', position: '-top-8 -left-8', size: 'w-16 h-16 md:w-20 md:h-20', delay: 0 },
        { id: 150, name: 'Mewtwo', position: '-bottom-8 -right-8', size: 'w-16 h-16 md:w-20 md:h-20', delay: 0.5 },
    ];

    // Background roaming Pokemon - ALL DIFFERENT, LARGER, MORE VISIBLE
    const backgroundPokemon = [
        { id: 6, name: 'Charizard', x: 10, y: 15, delay: 0, size: 'w-16 h-16 md:w-20 md:h-20' },
        { id: 9, name: 'Blastoise', x: 85, y: 70, delay: 0.5, size: 'w-16 h-16 md:w-20 md:h-20' },
        { id: 3, name: 'Venusaur', x: 90, y: 25, delay: 1, size: 'w-14 h-14 md:w-18 md:h-18' },
        { id: 149, name: 'Dragonite', x: 8, y: 75, delay: 0.8, size: 'w-14 h-14 md:w-18 md:h-18' },
        { id: 130, name: 'Gyarados', x: 50, y: 10, delay: 0.3, size: 'w-16 h-16 md:w-20 md:h-20' },
        { id: 143, name: 'Snorlax', x: 75, y: 50, delay: 1.2, size: 'w-14 h-14 md:w-18 md:h-18' },
    ];

    return (
        <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-4 relative">

            {/* Forest Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://i.etsystatic.com/18279207/r/il/96aeb2/6512099553/il_1588xN.6512099553_5zxs.jpg"
                    alt="Pokemon Forest Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35"></div>
            </div>

            {/* Background roaming Pokemon - larger and more visible */}
            <div className="absolute inset-0 z-5 pointer-events-none">
                {backgroundPokemon.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className="absolute animate-float-slow opacity-60 hover:opacity-100 transition-opacity"
                        style={{ left: `${pokemon.x}%`, top: `${pokemon.y}%`, animationDelay: `${pokemon.delay}s` }}
                    >
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`}
                            alt={pokemon.name}
                            className={`${pokemon.size} pixelated hover:scale-110 transition-transform pointer-events-auto cursor-pointer`}
                        />
                    </div>
                ))}
            </div>

            {/* Login Form Container */}
            <div className="relative z-10 w-full max-w-md">

                {/* Clickable Gen1 title - LARGER */}
                <div className="text-center mb-3">
                    <Link to="/" className="font-pixel text-base md:text-lg text-retro-green hover:text-retro-gold transition-colors">
                        GENERATION 1
                    </Link>
                </div>

                <div className="bg-black/70 backdrop-blur-sm pixel-border p-6 relative">

                    {/* Corner Pokemon */}
                    {cornerPokemon.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className={`absolute ${pokemon.position} animate-float pointer-events-none`}
                            style={{ animationDelay: `${pokemon.delay}s` }}
                        >
                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`}
                                alt={pokemon.name}
                                className={`${pokemon.size} pixelated opacity-90 hover:opacity-100 transition-opacity pointer-events-auto hover:scale-110 cursor-pointer`}
                            />
                        </div>
                    ))}

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="font-pixel text-2xl text-retro-green">TRAINER LOGIN</h1>
                        <div className="flex justify-center gap-1 mt-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-2 h-1 bg-retro-green"></div>
                            ))}
                        </div>
                    </div>

                    {/* Error Message - Show different styling for banned/suspended */}
                    {error && (
                        <div className={`p-4 mb-6 border-2 font-pixel text-xs text-center ${
                            errorType === 'banned' 
                                ? 'bg-red-900/30 border-red-600 text-red-400 animate-pulse' 
                                : errorType === 'suspended' 
                                ? 'bg-yellow-900/30 border-yellow-600 text-yellow-400' 
                                : 'bg-pixel-red/20 border-pixel-red text-pixel-red'
                        }`}>
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center mb-4">
                            <LoadingSpinner />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-pixel text-xs text-retro-green mb-2">TRAINER NAME</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 bg-black border-2 border-retro-green text-retro-gold font-retro text-lg focus:outline-none focus:border-retro-gold"
                                required
                                placeholder="Enter your trainer name"
                            />
                        </div>

                        <div>
                            <label className="block font-pixel text-xs text-retro-green mb-2">PASSWORD</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-black border-2 border-retro-green text-retro-gold font-retro text-lg focus:outline-none focus:border-retro-gold pr-10"
                                    required
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-retro-green"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            <p className="font-pixel text-[8px] text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>

                        <PixelButton type="submit" disabled={loading} className="w-full">
                            {loading ? 'LOGGING IN...' : 'LOGIN'}
                        </PixelButton>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <Link to="/forgot-password" className="block font-retro text-sm text-retro-gold hover:text-retro-green transition-colors">
                            Forgot Password?
                        </Link>
                        <div className="pt-2">
                            <Link to="/register" className="font-pixel text-xs text-gray-400 hover:text-retro-green transition-colors">
                                Don't have an account? Register here →
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="font-retro text-xs text-white/90">© 2026 CALM GROUP | Kanto Region</p>
                </div>
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-6px) translateX(8px); }
          50% { transform: translateY(0px) translateX(15px); }
          75% { transform: translateY(6px) translateX(8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default LoginPage;