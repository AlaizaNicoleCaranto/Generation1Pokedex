import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import PixelButton from '../common/PixelButton';
import LoadingSpinner from '../common/LoadingSpinner';
import soundService from '../../services/soundService';

// Reset Password Page - Set new password using token from email
const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract token from URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError('Invalid reset link. Please request a new password reset.');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        soundService.playClickSound();

        try {
            await authService.resetPassword(token, password);
            setMessage('✅ Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || '❌ Failed to reset password. Link may have expired.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-auto">

            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="w-full h-full bg-repeat" style={{ backgroundImage: 'radial-gradient(#4ade80 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md">

                {/* Back to Login */}
                <div className="text-center mb-4">
                    <Link to="/login" className="font-pixel text-xs text-retro-green hover:text-retro-gold transition-colors">
                        ← BACK TO LOGIN
                    </Link>
                </div>

                <div className="glass-card p-6 md:p-8">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-3 bg-retro-green/20 rounded-full flex items-center justify-center">
                            <span className="text-3xl">🔑</span>
                        </div>
                        <h1 className="font-pixel text-2xl text-text-dark">RESET PASSWORD</h1>
                        <div className="flex justify-center gap-1 mt-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-2 h-1 bg-retro-green"></div>
                            ))}
                        </div>
                        <p className="font-retro text-sm text-text-muted mt-3">
                            Enter your new password below.
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-4 p-3 bg-retro-green/20 border border-retro-green rounded-lg text-center">
                            <p className="font-pixel text-xs text-retro-green-dark">{message}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-pixel-red/20 border border-pixel-red rounded-lg text-center">
                            <p className="font-pixel text-xs text-pixel-red">{error}</p>
                            {error.includes('Invalid') && (
                                <Link to="/forgot-password" className="font-pixel text-xs text-retro-green hover:text-retro-gold mt-2 inline-block">
                                    Request new reset link →
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center mb-4">
                            <LoadingSpinner />
                        </div>
                    )}

                    {token && !message && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block font-pixel text-xs text-text-muted mb-2">NEW PASSWORD</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 input-retro pr-10"
                                        required
                                        placeholder="Minimum 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block font-pixel text-xs text-text-muted mb-2">CONFIRM NEW PASSWORD</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 input-retro pr-10"
                                        required
                                        placeholder="Confirm your new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                                    >
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <PixelButton type="submit" disabled={loading} className="w-full">
                                {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                            </PixelButton>
                        </form>
                    )}
                </div>

                <div className="text-center mt-4">
                    <p className="font-retro text-xs text-text-muted/50">© 2026 CALM GROUP | Kanto Region</p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;