import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import soundService from '../../services/soundService';

// Admin Users Management - Full CRUD operations for users
const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState('');
    const [reason, setReason] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setMessage('Failed to load users');
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, user, customReason = '') => {
        setActionLoading(true);
        setMessage(null);
        soundService.playClickSound();

        try {
            let result;
            switch (action) {
                case 'ban':
                    await adminService.banUser(user.username, customReason || 'No reason provided');
                    setMessage(`${user.username} has been banned.`);
                    break;
                case 'suspend':
                    await adminService.suspendUser(user.username, customReason || 'No reason provided');
                    setMessage(`${user.username} has been suspended.`);
                    break;
                case 'reactivate':
                    await adminService.reactivateUser(user.username);
                    setMessage(`${user.username} has been reactivated.`);
                    break;
                case 'reset-collection':
                    if (window.confirm(`Are you sure you want to reset ${user.username}'s Pokemon collection? This cannot be undone!`)) {
                        await adminService.resetUserCollection(user.username);
                        setMessage(`${user.username}'s collection has been reset.`);
                    }
                    break;
                case 'reset-password':
                    if (window.confirm(`Reset password for ${user.username}? A temporary password will be generated.`)) {
                        const result = await adminService.resetUserPassword(user.username);
                        setMessage(`Password reset for ${user.username}. Temporary password: ${result.temporaryPassword || 'Check console'}`);
                    }
                    break;
                default:
                    break;
            }
            await loadUsers();
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage(`Failed to ${action} ${user.username}`);
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setActionLoading(false);
            setShowReasonModal(false);
            setReason('');
        }
    };

    const openReasonModal = (action, user) => {
        setActionType(action);
        setSelectedUser(user);
        setShowReasonModal(true);
    };

    // Filter users based on search and status
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen p-6 relative overflow-auto">

            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-5">
                <div className="w-full h-full bg-repeat" style={{ backgroundImage: 'radial-gradient(#4ade80 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="font-pixel text-2xl text-pixel-red mb-2">👥 USER MANAGEMENT</h1>
                        <div className="flex gap-1">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-4 h-1 bg-pixel-red"></div>
                            ))}
                        </div>
                        <p className="font-retro text-sm text-text-muted mt-2">Manage trainers: ban, suspend, reset passwords, and more</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="font-pixel text-xs text-text-muted hover:text-retro-green transition-colors"
                    >
                        ← BACK TO DASHBOARD
                    </button>
                </div>

                {/* Message Alert */}
                {message && (
                    <div className="mb-6 p-3 bg-retro-green/20 border border-retro-green rounded-lg text-center">
                        <p className="font-pixel text-xs text-retro-green-dark">{message}</p>
                    </div>
                )}

                {/* Search and Filter Bar */}
                <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by trainer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 input-retro"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 input-retro"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="BANNED">Banned</option>
                    </select>
                </div>

                {/* Users Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-cream-dark bg-cream/30">
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-left">TRAINER</th>
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-center">ROLE</th>
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-center">STATUS</th>
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-center">POKEMON</th>
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-center">COMPLETION</th>
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-center">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.username} className="border-b border-cream-dark/50 hover:bg-cream/20 transition-colors">
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-retro-green to-green-600 flex items-center justify-center">
                                                    <span className="text-sm">{user.role === 'ADMIN' ? '👑' : '🎮'}</span>
                                                </div>
                                                <span className="font-retro text-text-dark font-medium">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`font-pixel text-xs px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'text-pixel-red bg-pixel-red/10' : 'text-retro-green-dark bg-retro-green/10'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`font-pixel text-xs px-2 py-1 rounded-full ${user.status === 'ACTIVE' ? 'text-retro-green-dark bg-retro-green/10' :
                                                user.status === 'SUSPENDED' ? 'text-retro-gold bg-retro-gold/10' : 'text-pixel-red bg-pixel-red/10'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-center font-retro text-text-muted">{user.pokemonCount}/151</td>
                                        <td className="py-3 px-2 text-center font-retro text-text-muted">{user.completionPercentage?.toFixed(1)}%</td>
                                        <td className="py-3 px-2 text-center">
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {user.status !== 'BANNED' && user.status !== 'SUSPENDED' && user.role !== 'ADMIN' && (
                                                    <>
                                                        <button
                                                            onClick={() => openReasonModal('suspend', user)}
                                                            disabled={actionLoading}
                                                            className="px-2 py-1 bg-retro-gold/20 border border-retro-gold rounded font-pixel text-[8px] text-retro-gold hover:bg-retro-gold/40 transition-colors"
                                                        >
                                                            SUSPEND
                                                        </button>
                                                        <button
                                                            onClick={() => openReasonModal('ban', user)}
                                                            disabled={actionLoading}
                                                            className="px-2 py-1 bg-pixel-red/20 border border-pixel-red rounded font-pixel text-[8px] text-pixel-red hover:bg-pixel-red/40 transition-colors"
                                                        >
                                                            BAN
                                                        </button>
                                                    </>
                                                )}
                                                {(user.status === 'BANNED' || user.status === 'SUSPENDED') && user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleAction('reactivate', user)}
                                                        disabled={actionLoading}
                                                        className="px-2 py-1 bg-retro-green/20 border border-retro-green rounded font-pixel text-[8px] text-retro-green-dark hover:bg-retro-green/40 transition-colors"
                                                    >
                                                        REACTIVATE
                                                    </button>
                                                )}
                                                {user.role !== 'ADMIN' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction('reset-collection', user)}
                                                            disabled={actionLoading}
                                                            className="px-2 py-1 bg-gray-200 border border-gray-300 rounded font-pixel text-[8px] text-text-muted hover:bg-gray-300 transition-colors"
                                                        >
                                                            RESET TEAM
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction('reset-password', user)}
                                                            disabled={actionLoading}
                                                            className="px-2 py-1 bg-blue-100 border border-blue-300 rounded font-pixel text-[8px] text-blue-600 hover:bg-blue-200 transition-colors"
                                                        >
                                                            RESET PWD
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="font-retro text-xs text-text-muted">Total Trainers: {filteredUsers.length}</p>
                </div>

                {/* Reason Modal */}
                {showReasonModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="glass-card max-w-md w-full p-6">
                            <h3 className="font-pixel text-lg text-text-dark mb-4">
                                {actionType === 'ban' ? 'Ban User' : 'Suspend User'}
                            </h3>
                            <p className="font-retro text-sm text-text-muted mb-3">
                                Reason for {actionType}ning {selectedUser.username}:
                            </p>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-3 py-2 input-retro mb-4"
                                rows="3"
                                placeholder="Enter reason..."
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAction(actionType, selectedUser, reason)}
                                    className={`flex-1 ${actionType === 'ban' ? 'btn-danger' : 'btn-secondary'}`}
                                >
                                    CONFIRM {actionType.toUpperCase()}
                                </button>
                                <button
                                    onClick={() => setShowReasonModal(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;