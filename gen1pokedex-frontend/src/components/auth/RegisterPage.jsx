import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PixelButton from '../common/PixelButton';
import LoadingSpinner from '../common/LoadingSpinner';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Corner Pokemon - both at bottom
    const cornerPokemon = [
        { id: 1, name: 'Bulbasaur', position: '-bottom-8 -left-8', size: 'w-16 h-16 md:w-20 md:h-20', delay: 0 },
        { id: 7, name: 'Squirtle', position: '-bottom-8 -right-8', size: 'w-16 h-16 md:w-20 md:h-20', delay: 0.5 },
    ];

    // Background roaming Pokemon - ALL DIFFERENT from login, LARGER
    const backgroundPokemon = [
        { id: 94, name: 'Gengar', x: 12, y: 18, delay: 0, size: 'w-16 h-16 md:w-20 md:h-20' },
        { id: 68, name: 'Machamp', x: 82, y: 72, delay: 0.5, size: 'w-16 h-16 md:w-20 md:h-20' },
        { id: 65, name: 'Alakazam', x: 88, y: 30, delay: 1, size: 'w-14 h-14 md:w-18 md:h-18' },
        { id: 112, name: 'Rhydon', x: 10, y: 80, delay: 0.8, size: 'w-14 h-14 md:w-18 md:h-18' },
        { id: 59, name: 'Arcanine', x: 45, y: 12, delay: 0.3, size: 'w-16 h-16 md:w-20 md:h-20' },
        { id: 134, name: 'Vaporeon', x: 75, y: 55, delay: 1.2, size: 'w-14 h-14 md:w-18 md:h-18' },
    ];

    const starters = [
        { id: 1, name: 'Bulbasaur', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif' },
        { id: 4, name: 'Charmander', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif' },
        { id: 7, name: 'Squirtle', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif' },
        { id: 25, name: 'Pikachu', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        setLoading(true);

        try {
            const result = await register(username, password, email);
            setSuccess({ message: 'Registration Successful!', username: result.username });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            const message = err.response?.data?.message;
            if (message?.includes('already exists')) {
                setError('Username already taken! Please choose another.');
            } else {
                setError(message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

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

            {/* Register Form Container */}
            <div className="relative z-10 w-full max-w-lg">

                <div className="bg-black/70 backdrop-blur-sm pixel-border p-6 relative">

                    {/* Corner Pokemon - both at bottom */}
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
                    <div className="text-center mb-4">
                        <h1 className="font-pixel text-2xl text-retro-green">NEW TRAINER</h1>
                        <div className="flex justify-center gap-1 mt-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-2 h-1 bg-retro-green"></div>
                            ))}
                        </div>
                    </div>

                    {/* Starter Pokemon Preview */}
                    <div className="flex justify-center gap-4 mb-4">
                        {starters.map((starter) => (
                            <div key={starter.id} className="text-center">
                                <img src={starter.sprite} alt={starter.name} className="w-10 h-10 md:w-12 md:h-12 pixelated opacity-80 hover:opacity-100 transition-all hover:scale-110" />
                            </div>
                        ))}
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-retro-green/20 border border-retro-green p-3 mb-4 text-center">
                            <p className="font-pixel text-xs text-retro-green">{success.message}</p>
                            <p className="font-retro text-sm text-retro-gold mt-1">Welcome {success.username}!</p>
                            <p className="font-pixel text-xs text-gray-400 mt-1">Redirecting to login...</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && !success && (
                        <div className="bg-pixel-red/20 border border-pixel-red p-3 mb-4">
                            <p className="font-pixel text-xs text-pixel-red text-center">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && !success && (
                        <div className="text-center mb-4">
                            <LoadingSpinner />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block font-pixel text-xs text-retro-green mb-1">TRAINER NAME</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 bg-black border-2 border-retro-green text-retro-gold font-retro text-lg focus:outline-none focus:border-retro-gold"
                                required
                                placeholder="Choose your trainer name"
                            />
                        </div>

                        <div>
                            <label className="block font-pixel text-xs text-retro-green mb-1">EMAIL (Optional)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-black border-2 border-retro-green text-retro-gold font-retro text-lg focus:outline-none focus:border-retro-gold"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block font-pixel text-xs text-retro-green mb-1">PASSWORD</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-black border-2 border-retro-green text-retro-gold font-retro text-lg focus:outline-none focus:border-retro-gold pr-10"
                                    required
                                    placeholder="Minimum 6 characters"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-retro-green">
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block font-pixel text-xs text-retro-green mb-1">CONFIRM PASSWORD</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-black border-2 border-retro-green text-retro-gold font-retro text-lg focus:outline-none focus:border-retro-gold pr-10"
                                    required
                                    placeholder="Confirm your password"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-retro-green">
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <PixelButton type="submit" disabled={loading} className="w-full">
                            {loading ? 'CREATING PROFILE...' : 'REGISTER'}
                        </PixelButton>
                    </form>

                    <div className="mt-4 text-center">
                        <Link to="/login" className="font-pixel text-xs text-gray-400 hover:text-retro-green transition-colors">
                            Already have an account? Login here →
                        </Link>
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

export default RegisterPage;