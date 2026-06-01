import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import PixelButton from '../common/PixelButton';
import LoadingSpinner from '../common/LoadingSpinner';
import soundService from '../../services/soundService';

/**
 * Forgot Password Page - Request password reset email
 * When user submits email, a token is generated and shown in backend terminal
 * User must copy that token and go to /reset-password?token=XXX
 */
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [showTokenInfo, setShowTokenInfo] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        soundService.playClickSound();

        try {
            await authService.forgotPassword(email);
            setMessage('✅ Password reset link has been sent!');
            setShowTokenInfo(true);
            setEmail('');
            // Don't auto-redirect - user needs to check terminal for token
        } catch (err) {
            const errorMsg = err.response?.data?.message || '❌ Failed to send reset link. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Background roaming Pokemon for consistent look
    const backgroundPokemon = [
        { id: 94, name: 'Gengar', x: 12, y: 18, delay: 0 },
        { id: 68, name: 'Machamp', x: 82, y: 72, delay: 0.5 },
        { id: 65, name: 'Alakazam', x: 88, y: 30, delay: 1 },
        { id: 112, name: 'Rhydon', x: 10, y: 80, delay: 0.8 },
        { id: 59, name: 'Arcanine', x: 45, y: 12, delay: 0.3 },
        { id: 134, name: 'Vaporeon', x: 75, y: 55, delay: 1.2 },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-auto">

            {/* Forest Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://i.etsystatic.com/18279207/r/il/96aeb2/6512099553/il_1588xN.6512099553_5zxs.jpg"
                    alt="Pokemon Forest Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Background roaming Pokemon */}
            <div className="absolute inset-0 z-5 pointer-events-none">
                {backgroundPokemon.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className="absolute animate-float-slow opacity-40"
                        style={{ left: `${pokemon.x}%`, top: `${pokemon.y}%`, animationDelay: `${pokemon.delay}s` }}
                    >
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`}
                            alt={pokemon.name}
                            className="w-14 h-14 md:w-16 md:h-16 pixelated"
                        />
                    </div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-md">

                {/* Back to Login */}
                <div className="text-center mb-4">
                    <Link to="/login" className="font-pixel text-xs text-retro-green hover:text-retro-gold transition-colors">
                        ← BACK TO LOGIN
                    </Link>
                </div>

                {/* Main Form Container */}
                <div className="bg-black/80 backdrop-blur-sm pixel-border p-6 relative">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-3 bg-retro-green/20 rounded-full flex items-center justify-center">
                            <span className="text-3xl">🔐</span>
                        </div>
                        <h1 className="font-pixel text-2xl text-retro-green">FORGOT PASSWORD?</h1>
                        <div className="flex justify-center gap-1 mt-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-2 h-1 bg-retro-green"></div>
                            ))}
                        </div>
                        <p className="font-retro text-sm text-retro-gold mt-3">
                            Enter your email to reset your password.
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-4 p-3 bg-retro-green/20 border border-retro-green rounded-lg text-center">
                            <p className="font-pixel text-xs text-retro-green-dark">{message}</p>
                            {showTokenInfo && (
                                <div className="mt-2 p-2 bg-black/50 rounded text-left">
                                    <p className="font-pixel text-[8px] text-gray-400">
                                        📌 Check your backend terminal for the reset token!
                                    </p>
                                    <p className="font-retro text-[10px] text-retro-gold mt-1">
                                        Then go to: /reset-password?token=YOUR_TOKEN
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-pixel-red/20 border border-pixel-red rounded-lg text-center">
                            <p className="font-pixel text-xs text-pixel-red">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center mb-4">
                            <LoadingSpinner />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block font-pixel text-xs text-retro-green mb-2">EMAIL ADDRESS</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-black/60 border-2 border-retro-green text-retro-gold font-retro text-lg focus:outline-none focus:border-retro-gold rounded"
                                required
                                placeholder="your@email.com"
                            />
                            <p className="font-pixel text-[8px] text-gray-500 mt-1">
                                Enter the email you used to register.
                            </p>
                        </div>

                        <PixelButton type="submit" disabled={loading} className="w-full">
                            {loading ? 'SENDING...' : 'SEND RESET LINK'}
                        </PixelButton>
                    </form>

                    {/* Only ONE back link - removed duplicate */}
                    <div className="mt-6 text-center">
                        <Link to="/login" className="font-pixel text-xs text-gray-400 hover:text-retro-green transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="font-retro text-xs text-white/70">© 2026 CALM GROUP | Kanto Region</p>
                </div>
            </div>

            <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-6px) translateX(8px); }
          50% { transform: translateY(0px) translateX(15px); }
          75% { transform: translateY(6px) translateX(8px); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default ForgotPasswordPage;