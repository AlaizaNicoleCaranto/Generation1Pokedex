import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import soundService from '../../services/soundService';

// Admin Audit Logs - View all admin actions
const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllAuditLogs();
            setLogs(data);
        } catch (err) {
            console.error('Failed to load logs:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get unique actions for filter
    const actions = ['ALL', ...new Set(logs.map(log => log.action))];

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen p-6 relative overflow-auto">

            <div className="absolute inset-0 z-0 opacity-5">
                <div className="w-full h-full bg-repeat" style={{ backgroundImage: 'radial-gradient(#4ade80 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="font-pixel text-2xl text-pixel-red mb-2">📋 AUDIT LOGS</h1>
                        <div className="flex gap-1">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-4 h-1 bg-pixel-red"></div>
                            ))}
                        </div>
                        <p className="font-retro text-sm text-text-muted mt-2">Track all admin actions and system events</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="font-pixel text-xs text-text-muted hover:text-retro-green transition-colors"
                    >
                        ← BACK TO DASHBOARD
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by username or action..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 input-retro"
                        />
                    </div>
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="px-4 py-2 input-retro"
                    >
                        {actions.map(action => (
                            <option key={action} value={action}>{action}</option>
                        ))}
                    </select>
                </div>

                {/* Logs Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-cream-dark bg-cream/30">
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-left">TIMESTAMP</th>
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-left">USER</th>
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-left">ACTION</th>
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-left">ENTITY</th>
                                    <th className="font-pixel text-xs text-text-dark py-3 px-2 text-left">DETAILS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log, idx) => (
                                    <tr key={idx} className="border-b border-cream-dark/50 hover:bg-cream/20 transition-colors">
                                        <td className="py-2 px-2">
                                            <span className="font-retro text-xs text-text-muted">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-2 px-2">
                                            <span className="font-retro text-sm text-text-dark">{log.username}</span>
                                        </td>
                                        <td className="py-2 px-2">
                                            <span className={`font-pixel text-xs px-2 py-1 rounded-full ${log.action.includes('BAN') ? 'text-pixel-red bg-pixel-red/10' :
                                                    log.action.includes('SUSPEND') ? 'text-retro-gold bg-retro-gold/10' :
                                                        log.action.includes('CREATE') ? 'text-retro-green-dark bg-retro-green/10' :
                                                            log.action.includes('DELETE') ? 'text-pixel-red bg-pixel-red/10' :
                                                                'text-text-muted bg-cream/50'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-2 px-2">
                                            <span className="font-retro text-sm text-text-muted">{log.entityType}</span>
                                        </td>
                                        <td className="py-2 px-2">
                                            <span className="font-retro text-xs text-text-muted">{log.details || '-'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredLogs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="font-pixel text-text-muted">No audit logs found.</p>
                    </div>
                )}

                <div className="text-center mt-6">
                    <p className="font-retro text-xs text-text-muted">Total Logs: {filteredLogs.length}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminAuditLogs;