import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import soundService from '../../services/soundService';

/**
 * Navigation Bar - Appears on all pages after login
 * Shows logo, navigation links, and user avatar with dropdown
 */
const Navbar = () => {
    const { user, logout, userProfile } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [avatarImage, setAvatarImage] = useState(null);
    const navigate = useNavigate();
    const isAdmin = userProfile?.role === 'ADMIN';
    const location = useLocation();

    // Use profile avatar if available, otherwise fallback to localStorage backup
    useEffect(() => {
        if (user?.username) {
            // User is logged in - load their avatar
            if (userProfile?.avatarUrl) {
                setAvatarImage(userProfile.avatarUrl);
                return;
            }
            // Fallback to localStorage if profile avatar not yet loaded
            const savedAvatar = localStorage.getItem(`avatar_${user?.username}`);
            if (savedAvatar) setAvatarImage(savedAvatar);
        } else {
            // User logged out - clear avatar
            setAvatarImage(null);
        }
    }, [user?.username, userProfile?.avatarUrl]);

    const handleLogout = () => {
        soundService.playClickSound();
        logout();
        navigate('/login');
    };

    const handleNavClick = () => {
        soundService.playClickSound();
        setShowDropdown(false);
    };

    const getDefaultAvatar = () => ({
        emoji: isAdmin ? '👑' : '🎮',
        gradient: isAdmin ? 'from-yellow-500 to-amber-600' : 'from-retro-green to-green-600',
    });

    const defaultAvatar = getDefaultAvatar();

    return (
        <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm shadow-lg border-b border-retro-green/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-14">

                    {/* Logo - Left side */}
                    <Link to="/dashboard" onClick={handleNavClick} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-full bg-white border border-black relative overflow-hidden shadow-md">
                            <div className="absolute inset-x-0 top-0 h-1/2 bg-red-500"></div>
                            <div className="absolute inset-x-0 top-1/2 h-1 bg-black"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-black border-2 border-white"></div>
                            </div>
                        </div>
                        <span className="font-pixel text-sm nav-logo hidden sm:inline">GEN1 POKEDEX</span>
                    </Link>

                    {/* Navigation Links - Center */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {['/dashboard','/pokedex',`/collection/${user?.username}`,'/leaderboard'].map((path, idx) => {
                            const labels = ['HOME','POKEDEX','COLLECTION','RANK'];
                            const to = path;
                            const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
                            return (
                                <Link
                                    key={path}
                                    to={to}
                                    onClick={handleNavClick}
                                    className={`nav-link font-pixel text-[10px] ${active ? 'nav-link-active' : 'text-gray-300 hover:text-retro-green'} transition-colors`}
                                >
                                    {labels[idx]}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Avatar + Username - Right side */}
                    <div className="relative flex items-center gap-2">
                        {/* Username - shown next to avatar */}
                        <span className="font-retro text-sm text-gray-300 hidden sm:inline">
                            {user?.username}
                        </span>

                        {/* Avatar Dropdown Trigger */}
                        <button
                            onClick={() => {
                                soundService.playClickSound();
                                setShowDropdown(!showDropdown);
                            }}
                            className="focus:outline-none"
                        >
                            <div className="relative group">
                                {avatarImage ? (
                                    <img src={avatarImage} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-retro-green hover:border-retro-gold transition-all" />
                                ) : (
                                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${defaultAvatar.gradient} flex items-center justify-center border-2 border-retro-green hover:border-retro-gold transition-all`}>
                                        <span className="text-sm">{defaultAvatar.emoji}</span>
                                    </div>
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-retro-green rounded-full border-2 border-black"></div>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-retro-green/30 shadow-xl z-50 overflow-hidden rounded-lg top-full">
                                    <div className="px-4 py-3 border-b border-retro-green/20 bg-retro-green/10">
                                        <p className="font-retro text-sm text-retro-gold font-semibold">{user?.username}</p>
                                        <p className="font-pixel text-[8px] text-gray-400">{isAdmin ? 'Administrator' : 'Trainer'}</p>
                                    </div>
                                    <Link to={`/profile/${user?.username}`} onClick={handleNavClick} className="flex items-center gap-3 px-4 py-2.5 hover:bg-retro-green/10 transition-colors">
                                        <span className="text-lg">👤</span>
                                        <span className="font-pixel text-xs text-gray-300">Profile</span>
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-pixel-red/10 transition-colors text-left">
                                        <span className="text-lg">🚪</span>
                                        <span className="font-pixel text-xs text-pixel-red">Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;