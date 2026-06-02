import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import soundService from '../../services/soundService';

/**
 * Admin Dashboard - Admin users see system stats and management options
 * Only accessible by users with ROLE_ADMIN
 */
const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            setLoading(true);
            const [systemStats, users, logs] = await Promise.all([
                adminService.getSystemStats(),
                adminService.getAllUsers(),
                adminService.getAllAuditLogs()
            ]);
            setStats(systemStats);
            setRecentUsers(users.slice(0, 5));
            setRecentLogs(logs.slice(0, 5));
        } catch (err) {
            console.error('Failed to load admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNavClick = (path) => {
        soundService.playClickSound();
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="min-h-screen p-6 relative">
            {/* Dark background for readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]"></div>

            <div className="container mx-auto max-w-6xl relative z-10">

                {/* Admin Header */}
                <div className="text-center mb-8">
                    <h1 className="font-pixel text-2xl md:text-3xl text-pixel-red mb-2 animate-pulse">
                        ADMIN DASHBOARD
                    </h1>
                    <div className="flex justify-center gap-1 mt-2">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-4 h-1 bg-pixel-red"></div>
                        ))}
                    </div>
                    <p className="font-retro text-sm text-gray-400 mt-2">
                        System Management Panel
                    </p>
                </div>

                {/* Stats Grid - All cards have SAME animation */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {/* Total Users */}
                    <Link to="/admin/users" onClick={() => handleNavClick('/admin/users')}>
                        <div className="bg-black/70 pixel-border p-4 text-center hover:scale-105 transition-all duration-300 cursor-pointer group">
                            <div className="text-3xl mb-2 group-hover:animate-bounce">👥</div>
                            <p className="font-pixel text-xs text-gray-400">TOTAL USERS</p>
                            <p className="font-retro text-2xl text-retro-gold">{stats?.totalUsers || 0}</p>
                        </div>
                    </Link>

                    {/* Total Pokemon */}
                    <Link to="/admin/pokemons" onClick={() => handleNavClick('/admin/pokemons')}>
                        <div className="bg-black/70 pixel-border p-4 text-center hover:scale-105 transition-all duration-300 cursor-pointer group">
                            <div className="text-3xl mb-2 group-hover:animate-bounce">📦</div>
                            <p className="font-pixel text-xs text-gray-400">TOTAL POKEMON</p>
                            <p className="font-retro text-2xl text-retro-gold">{stats?.totalPokemons || 151}</p>
                        </div>
                    </Link>

                    {/* Active Users */}
                    <Link to="/admin/users" onClick={() => handleNavClick('/admin/users')}>
                        <div className="bg-black/70 pixel-border p-4 text-center hover:scale-105 transition-all duration-300 cursor-pointer group">
                            <div className="text-3xl mb-2 group-hover:animate-bounce">🟢</div>
                            <p className="font-pixel text-xs text-gray-400">ACTIVE USERS</p>
                            <p className="font-retro text-2xl text-retro-green">{stats?.activeUsers || 0}</p>
                        </div>
                    </Link>

                    {/* Audit Logs */}
                    <Link to="/admin/audit-logs" onClick={() => handleNavClick('/admin/audit-logs')}>
                        <div className="bg-black/70 pixel-border p-4 text-center hover:scale-105 transition-all duration-300 cursor-pointer group">
                            <div className="text-3xl mb-2 group-hover:animate-bounce">📝</div>
                            <p className="font-pixel text-xs text-gray-400">AUDIT LOGS</p>
                            <p className="font-retro text-2xl text-retro-gold">{stats?.totalAuditLogs || 0}</p>
                        </div>
                    </Link>
                </div>

                {/* User Status Breakdown - Same animation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-black/70 pixel-border p-4 text-center hover:scale-105 transition-all duration-300">
                        <p className="font-pixel text-xs text-retro-green animate-pulse">✅ ACTIVE</p>
                        <p className="font-retro text-xl text-retro-gold">{stats?.activeUsers || 0}</p>
                    </div>
                    <div className="bg-black/70 pixel-border p-4 text-center hover:scale-105 transition-all duration-300">
                        <p className="font-pixel text-xs text-retro-gold animate-pulse">⏸️ SUSPENDED</p>
                        <p className="font-retro text-xl text-retro-gold">{stats?.suspendedUsers || 0}</p>
                    </div>
                    <div className="bg-black/70 pixel-border p-4 text-center hover:scale-105 transition-all duration-300">
                        <p className="font-pixel text-xs text-pixel-red animate-pulse">🚫 BANNED</p>
                        <p className="font-retro text-xl text-pixel-red">{stats?.bannedUsers || 0}</p>
                    </div>
                </div>

                {/* Quick Action Buttons - REMOVED Detailed Stats (broken link) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <Link to="/admin/users" onClick={() => handleNavClick('/admin/users')}>
                        <div className="bg-black/50 pixel-border p-4 text-center hover:bg-pixel-red/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="text-2xl mb-2">👥</div>
                            <p className="font-pixel text-xs text-pixel-red">MANAGE USERS</p>
                        </div>
                    </Link>
                    <Link to="/admin/pokemons" onClick={() => handleNavClick('/admin/pokemons')}>
                        <div className="bg-black/50 pixel-border p-4 text-center hover:bg-pixel-red/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="text-2xl mb-2">📦</div>
                            <p className="font-pixel text-xs text-pixel-red">MANAGE POKEMON</p>
                        </div>
                    </Link>
                    <Link to="/admin/audit-logs" onClick={() => handleNavClick('/admin/audit-logs')}>
                        <div className="bg-black/50 pixel-border p-4 text-center hover:bg-pixel-red/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="text-2xl mb-2">📋</div>
                            <p className="font-pixel text-xs text-pixel-red">AUDIT LOGS</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Users Table */}
                <div className="bg-black/70 pixel-border p-6 mb-6">
                    <h2 className="font-pixel text-sm text-pixel-red mb-4">📋 RECENT USERS</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="font-pixel text-xs text-gray-400 py-2">USERNAME</th>
                                    <th className="font-pixel text-xs text-gray-400 py-2">ROLE</th>
                                    <th className="font-pixel text-xs text-gray-400 py-2">STATUS</th>
                                    <th className="font-pixel text-xs text-gray-400 py-2">POKEMON</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user) => (
                                    <tr key={user.username} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                        <td className="font-retro text-sm text-retro-gold py-2">{user.username}</td>
                                        <td className="font-retro text-sm text-gray-400 py-2">{user.role}</td>
                                        <td className="font-retro text-sm py-2">
                                            <span className={`px-2 py-0.5 text-xs ${user.status === 'ACTIVE' ? 'text-retro-green' :
                                                    user.status === 'SUSPENDED' ? 'text-retro-gold' : 'text-pixel-red'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="font-retro text-sm text-gray-400 py-2">{user.pokemonCount || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Audit Logs */}
                <div className="bg-black/70 pixel-border p-6">
                    <h2 className="font-pixel text-sm text-pixel-red mb-4">📝 RECENT AUDIT LOGS</h2>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {recentLogs.map((log, idx) => (
                            <div key={idx} className="border-l-2 border-pixel-red pl-3 py-1 hover:bg-white/5 transition-colors">
                                <p className="font-retro text-xs text-gray-400">
                                    [{new Date(log.timestamp).toLocaleString()}]
                                    <span className="text-pixel-red ml-2">{log.action}</span>
                                    <span className="text-gray-500 ml-2">- {log.username}</span>
                                </p>
                            </div>
                        ))}
                        {recentLogs.length === 0 && (
                            <p className="font-retro text-sm text-gray-500 text-center py-4">No audit logs yet.</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="font-retro text-xs text-gray-500">
                        Admin Dashboard • Gen1 Pokedex System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;