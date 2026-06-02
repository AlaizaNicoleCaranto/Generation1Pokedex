import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import LoadingSpinner from '../common/LoadingSpinner';
import soundService from '../../services/soundService';

/**
 * Leaderboard Page - Shows top trainers ranked by Pokemon caught
 * Features: Medal icons, hover effects, smooth animations
 */
const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await userService.getLeaderboard();
            setUsers(data);
        } catch (err) {
            setError('Failed to load leaderboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (username) => {
        soundService.playClickSound();
    };

    const navigate = useNavigate();

    if (loading) return <LoadingSpinner fullScreen />;
    if (error) return <div className="text-center text-pixel-red p-8">{error}</div>;

    const getMedal = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `${index + 1}`;
    };

    const getMedalColor = (index) => {
        if (index === 0) return 'text-retro-gold';
        if (index === 1) return 'text-gray-400';
        if (index === 2) return 'text-amber-600';
        return 'text-gray-500';
    };

    return (
        <div className="min-h-screen p-6 relative">
            {/* Dark background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]"></div>

            <div className="container mx-auto max-w-4xl relative z-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-pixel text-2xl md:text-3xl text-retro-green mb-2 animate-pulse">
                        TRAINER LEADERBOARD
                    </h1>
                    <p className="font-retro text-lg text-retro-gold">Top Pokemon Masters</p>
                    <div className="flex justify-center gap-1 mt-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-4 h-1 bg-retro-green"></div>
                        ))}
                    </div>
                    <p className="font-pixel text-[8px] text-gray-400 mt-2">Ranked by number of Pokemon caught</p>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-black/70 pixel-border overflow-hidden rounded-xl">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-retro-green bg-retro-green/10">
                                <th className="font-pixel text-xs text-retro-green py-3 px-2 text-center">RANK</th>
                                <th className="font-pixel text-xs text-retro-green py-3 px-2 text-left">TRAINER</th>
                                <th className="font-pixel text-xs text-retro-green py-3 px-2 text-center">POKEMON</th>
                                <th className="font-pixel text-xs text-retro-green py-3 px-2 text-center">COMPLETION</th>
                                <th className="font-pixel text-xs text-retro-green py-3 px-2 text-center">BADGES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr
                                    key={user.username}
                                    onClick={() => { handleRowClick(user.username); navigate(`/profile/${user.username}`); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { handleRowClick(user.username); navigate(`/profile/${user.username}`); } }}
                                    role="button"
                                    tabIndex={0}
                                    className={`border-b border-gray-800 hover:bg-retro-green/10 transition-all duration-300 cursor-pointer ${index === 0 ? 'bg-retro-gold/5' : ''}`}
                                >
                                    <td className="py-3 px-2 text-center">
                                        <span className={`font-retro text-xl ${getMedalColor(index)}`}>
                                            {getMedal(index)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2">
                                        <span className="font-retro text-retro-gold hover:text-retro-green transition-colors">
                                            {user.username}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        <span className="font-retro text-retro-gold">{user.pokemonCount}</span>
                                        <span className="font-pixel text-[8px] text-gray-500 ml-1">/151</span>
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        <span className="font-retro text-retro-green">{user.completionPercentage?.toFixed(1)}%</span>
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        <span className="font-retro text-retro-gold">{user.badges?.length || 0}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {users.length === 0 && (
                        <div className="text-center py-8">
                            <p className="font-pixel text-gray-400">No trainers found.</p>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <div className="text-center mt-6">
                    <p className="font-pixel text-[8px] text-gray-500">
                        Click on any trainer to view their profile
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;