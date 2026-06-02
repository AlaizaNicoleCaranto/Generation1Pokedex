import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import LoadingSpinner from '../common/LoadingSpinner';
import PixelButton from '../common/PixelButton';
import soundService from '../../services/soundService';

/**
 * User Profile Page - Complete profile with avatar, edit, change password
 * Fixed: Added proper background and styling
 */
const UserProfile = () => {
    const { username } = useParams();
    const { user, userProfile, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showAvatarUpload, setShowAvatarUpload] = useState(false);
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [avatarImage, setAvatarImage] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [avatarStatus, setAvatarStatus] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [uploading, setUploading] = useState(false);

    const isOwnProfile = user?.username === username;
    // Check if viewing own profile - enables edit/password change functionality
    const isAdmin = userProfile?.role === 'ADMIN';

    // Load saved avatar from localStorage
    useEffect(() => {
        const savedAvatar = localStorage.getItem(`avatar_${username}`);
        if (savedAvatar) {
            setAvatarImage(savedAvatar);
        }
    }, [username]);

    useEffect(() => {
        loadProfile();
    }, [username]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const profileData = await userService.getProfile(username);
            const badgesData = await userService.getBadges(username);
            const savedAvatar = localStorage.getItem(`avatar_${username}`);
            setProfile(profileData);
            setBadges(badgesData);
            setEmail(profileData.email || '');
            setBio(profileData.bio || '');
            setAvatarImage(profileData.avatarUrl || savedAvatar || null);
        } catch (err) {
            setMessage('Failed to load profile');
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const updatedProfile = await userService.updateProfile(username, email, bio, avatarImage || profile?.avatarUrl || null);
            await refreshProfile();
            setProfile(updatedProfile);
            setAvatarImage(updatedProfile.avatarUrl || null);
            setEditing(false);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setError('Failed to update profile');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleChangePassword = async () => {
        setPasswordError(null);
        if (newPassword !== confirmNewPassword) {
            setPasswordError('New passwords do not match!');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        try {
            await authService.changePassword(username, currentPassword, newPassword);
            setChangingPassword(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setPasswordError(null);
            setMessage('Password changed successfully!');
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            const apiMessage = err.response?.data?.message || err.response?.data?.error;
            setPasswordError(apiMessage || err.message || 'Unable to change password. Please check your current password and try again.');
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file (PNG, JPG, GIF, etc.).');
                setTimeout(() => setError(null), 3000);
                return;
            }

            const maxSizeBytes = 1024 * 1024; // 1 MB
            if (file.size > maxSizeBytes) {
                setError('Avatar image is too large. Please choose an image under 1 MB.');
                setTimeout(() => setError(null), 4000);
                return;
            }

            setUploading(true);
            setError(null);
            setAvatarStatus(null);
            try {
                const updatedProfile = await userService.updateAvatar(username, file);
                setProfile(updatedProfile);
                setAvatarImage(updatedProfile.avatarUrl || null);
                if (updatedProfile.avatarUrl) {
                    localStorage.setItem(`avatar_${username}`, updatedProfile.avatarUrl);
                } else {
                    localStorage.removeItem(`avatar_${username}`);
                }
                setAvatarStatus('Avatar uploaded successfully!');
                setMessage('Avatar updated!');
                setTimeout(() => setShowAvatarUpload(false), 1500);
                setTimeout(() => setMessage(null), 3000);
            } catch (err) {
                const serverMessage = err.response?.data?.message || err.message;
                setError(`Failed to upload avatar. ${serverMessage}`);
                setTimeout(() => setError(null), 5000);
            } finally {
                setUploading(false);
            }
        }
    };

    const removeAvatar = async () => {
        try {
            const updatedProfile = await userService.updateProfile(username, email, bio, '');
            setProfile(updatedProfile);
            setAvatarImage(null);
            localStorage.removeItem(`avatar_${username}`);
            setShowAvatarUpload(false);
            setMessage('Avatar removed');
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setError('Failed to remove avatar');
            setTimeout(() => setError(null), 3000);
        }
    };

    const getDefaultAvatar = () => {
        if (profile?.role === 'ADMIN') {
            return {
                emoji: '👑',
                gradient: 'from-yellow-500 to-amber-600',
            };
        }
        return {
            emoji: '🎮',
            gradient: 'from-retro-green to-green-600',
        };
    };

    const defaultAvatar = getDefaultAvatar();
    const trainerLevel = Math.max(1, Math.floor((profile?.pokemonCount || 0) / 10) + 1);

    if (loading) return <LoadingSpinner fullScreen />;
    if (!profile) return <div className="text-center text-pixel-red p-8">User not found</div>;

    return (
        <div className="min-h-screen p-6 relative overflow-auto">
            {/* Dark background for readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]"></div>

            {/* Subtle Pokemon pattern background */}
            <div className="absolute inset-0 z-0 opacity-5">
                <div className="w-full h-full bg-repeat" style={{ backgroundImage: 'radial-gradient(#4ade80 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="container mx-auto max-w-4xl relative z-10">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 font-pixel text-sm text-gray-400 hover:text-retro-green transition-colors"
                >
                    ← BACK
                </button>

                {/* Message Alerts */}
                {message && (
                    <div className="mb-6 p-3 bg-retro-green/20 border border-retro-green rounded-lg text-center">
                        <p className="font-pixel text-xs text-retro-green-dark">{message}</p>
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-3 bg-pixel-red/20 border border-pixel-red rounded-lg text-center">
                        <p className="font-pixel text-xs text-pixel-red">{error}</p>
                    </div>
                )}

                {/* Main Profile Card */}
                <div className="bg-black/80 backdrop-blur-sm border border-retro-green/30 rounded-xl p-6 md:p-8">

                    {/* Header with Avatar and Name */}
                    <div className="text-center mb-6">
                        {/* Avatar - Clickable to change */}
                        <div className="relative inline-block group">
                            <div className="w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border-4 border-retro-green shadow-lg">
                                {avatarImage ? (
                                    <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${defaultAvatar.gradient} flex items-center justify-center`}>
                                        <span className="text-5xl">{defaultAvatar.emoji}</span>
                                    </div>
                                )}
                            </div>
                            {isOwnProfile && (
                                <button
                                    onClick={() => setShowAvatarUpload(true)}
                                    className="absolute bottom-0 right-4 bg-black/70 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="text-sm">📷</span>
                                </button>
                            )}
                        </div>

                        <h1 className="font-pixel text-2xl md:text-3xl text-retro-gold">{profile.username}</h1>
                        <div className="flex justify-center gap-2 mt-2 flex-wrap">
                            <span className="px-3 py-1 bg-retro-green/20 rounded-full font-pixel text-xs text-retro-green-dark">
                                {profile.role}
                            </span>
                            <span className="px-3 py-1 bg-retro-gold/20 rounded-full font-pixel text-xs text-retro-gold">
                                Lv. {trainerLevel}
                            </span>
                            <span className={`px-3 py-1 rounded-full font-pixel text-xs ${profile.status === 'ACTIVE' ? 'bg-retro-green/20 text-retro-green-dark' :
                                    profile.status === 'SUSPENDED' ? 'bg-retro-gold/20 text-retro-gold' : 'bg-pixel-red/20 text-pixel-red'
                                }`}>
                                {profile.status}
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-black/50 rounded-xl p-3 text-center border border-retro-green/20">
                            <div className="text-2xl mb-1">📖</div>
                            <p className="font-pixel text-xs text-gray-400">POKEDEX</p>
                            <p className="font-retro text-xl text-retro-gold">{profile.pokemonCount}/151</p>
                        </div>
                        <div className="bg-black/50 rounded-xl p-3 text-center border border-retro-green/20">
                            <div className="text-2xl mb-1">⭐</div>
                            <p className="font-pixel text-xs text-gray-400">FAVORITES</p>
                            <p className="font-retro text-xl text-retro-gold">{profile.favoriteCount}</p>
                        </div>
                        <div className="bg-black/50 rounded-xl p-3 text-center border border-retro-green/20">
                            <div className="text-2xl mb-1">🏆</div>
                            <p className="font-pixel text-xs text-gray-400">BADGES</p>
                            <p className="font-retro text-xl text-retro-gold">{badges.length}</p>
                        </div>
                        <div className="bg-black/50 rounded-xl p-3 text-center border border-retro-green/20">
                            <div className="text-2xl mb-1">📊</div>
                            <p className="font-pixel text-xs text-gray-400">COMPLETION</p>
                            <p className="font-retro text-xl text-retro-gold">{profile.completionPercentage?.toFixed(1)}%</p>
                        </div>
                    </div>

                    {/* Completion Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-1">
                            <span className="font-pixel text-xs text-gray-400">POKEDEX COMPLETION</span>
                            <span className="font-pixel text-xs text-retro-green-dark">{profile.completionPercentage?.toFixed(1)}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${profile.completionPercentage || 0}%` }}></div>
                        </div>
                    </div>

                    {/* Profile Info - Editable Section */}
                    <div className="bg-black/50 rounded-xl p-4 mb-6 border border-retro-green/20">
                        <h3 className="font-pixel text-sm text-retro-green mb-3">TRAINER INFO</h3>

                        {editing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-pixel text-xs text-gray-400 mb-1">EMAIL</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block font-pixel text-xs text-gray-400 mb-1">BIO</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 bg-black/60 border border-retro-green rounded text-white"
                                        placeholder="Tell other trainers about yourself..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleUpdateProfile} className="flex-1 btn-primary">
                                        SAVE CHANGES
                                    </button>
                                    <button onClick={() => setEditing(false)} className="flex-1 btn-secondary">
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-2">
                                    <p className="font-pixel text-xs text-gray-400">EMAIL</p>
                                    <p className="font-retro text-white">{profile.email || 'Not set'}</p>
                                </div>
                                <div className="mb-2">
                                    <p className="font-pixel text-xs text-gray-400">BIO</p>
                                    <p className="font-retro text-white">{profile.bio || 'No bio yet.'}</p>
                                </div>
                                {isOwnProfile && (
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => setEditing(true)} className="btn-primary">
                                            EDIT PROFILE
                                        </button>
                                        <button onClick={() => {
                                            setChangingPassword(true);
                                            setPasswordError(null);
                                        }} className="btn-secondary">
                                            CHANGE PASSWORD
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Badges Section */}
                    <div>
                        <h3 className="font-pixel text-sm text-retro-green mb-3">🏆 EARNED BADGES</h3>
                        {badges.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {badges.map((badge, idx) => (
                                    <div key={badge.id} className="text-center group cursor-pointer" style={{ animationDelay: `${idx * 0.05}s` }}>
                                        <div className="w-16 h-16 bg-retro-gold/20 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform group-hover:bg-retro-gold/30 border border-retro-gold/30">
                                            {badge.iconUrl || '🏅'}
                                        </div>
                                        <p className="font-pixel text-[8px] text-gray-400 mt-1 group-hover:text-retro-gold transition-colors">{badge.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="font-pixel text-xs text-gray-500 text-center py-4">
                                No badges yet. Keep catching Pokemon to earn achievements!
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <Link to={`/collection/${username}`}>
                        <button className="w-full btn-primary">🎒 VIEW MY POKEMON</button>
                    </Link>
                    <Link to="/leaderboard">
                        <button className="w-full btn-secondary">🏆 VIEW LEADERBOARD</button>
                    </Link>
                </div>
            </div>

            {/* Change Avatar Modal */}
            {showAvatarUpload && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a2e] border border-retro-green rounded-xl max-w-md w-full p-6">
                        <h3 className="font-pixel text-lg text-retro-green mb-4">Change Avatar</h3>

                        <div className="flex justify-center mb-6">
                            {avatarImage ? (
                                <img src={avatarImage} alt="Current Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-retro-green" />
                            ) : (
                                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${defaultAvatar.gradient} flex items-center justify-center border-4 border-retro-green`}>
                                    <span className="text-4xl">{defaultAvatar.emoji}</span>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />

                        <button
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                            disabled={uploading}
                            className="w-full btn-primary mb-3 disabled:opacity-50"
                        >
                            {uploading ? 'UPLOADING...' : '📷 CHOOSE IMAGE'}
                        </button>

                            {avatarStatus && (
                                <div className="mb-3 p-3 bg-retro-green/10 border border-retro-green rounded text-center">
                                    <p className="font-pixel text-xs text-retro-green-dark">{avatarStatus}</p>
                                </div>
                            )}


                        <button
                            onClick={() => setShowAvatarUpload(false)}
                            className="w-full btn-secondary"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {changingPassword && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a2e] border border-retro-green rounded-xl max-w-md w-full p-6">
                        <h3 className="font-pixel text-lg text-retro-green mb-4">Change Password</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-pixel text-xs text-gray-400 mb-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-2 bg-black/60 border border-retro-green rounded text-white pr-10"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showCurrentPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block font-pixel text-xs text-gray-400 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 bg-black/60 border border-retro-green rounded text-white pr-10"
                                        placeholder="Minimum 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showNewPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block font-pixel text-xs text-gray-400 mb-1">Confirm New Password</label>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/60 border border-retro-green rounded text-white"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            {passwordError && (
                                <div className="p-3 bg-pixel-red/20 border border-pixel-red rounded-lg text-center text-sm text-pixel-red">
                                    {passwordError}
                                </div>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button onClick={handleChangePassword} className="flex-1 btn-primary">
                                    UPDATE PASSWORD
                                </button>
                                <button onClick={() => {
                                    setChangingPassword(false);
                                    setPasswordError(null);
                                }} className="flex-1 btn-secondary">
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;