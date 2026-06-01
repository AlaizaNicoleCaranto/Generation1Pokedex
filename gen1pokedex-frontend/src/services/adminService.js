import api from './api';

// Admin service - only accessible by users with ROLE_ADMIN
// All endpoints require admin privileges on backend
export const adminService = {
    // Get all users in the system
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    // Get detailed information about a specific user
    getUserDetails: async (username) => {
        const response = await api.get(`/admin/users/${username}`);
        return response.data;
    },

    // Permanently ban a user
    banUser: async (username, reason) => {
        const response = await api.post(`/admin/users/${username}/ban`, null, { params: { reason } });
        return response.data;
    },

    // Temporarily suspend a user
    suspendUser: async (username, reason) => {
        const response = await api.post(`/admin/users/${username}/suspend`, null, { params: { reason } });
        return response.data;
    },

    // Reactivate a banned or suspended user
    reactivateUser: async (username) => {
        const response = await api.post(`/admin/users/${username}/reactivate`);
        return response.data;
    },

    // Clear all Pokemon from a user's collection
    resetUserCollection: async (username) => {
        const response = await api.delete(`/admin/users/${username}/collection`);
        return response.data;
    },

    // Reset user's password (generates temporary password)
    resetUserPassword: async (username) => {
        const response = await api.post(`/admin/users/${username}/reset-password`);
        return response.data;
    },

    // Update user account status directly
    updateUserStatus: async (username, status) => {
        const response = await api.put(`/admin/users/${username}/status`, null, { params: { newStatus: status } });
        return response.data;
    },

    // Get all audit logs
    getAllAuditLogs: async () => {
        const response = await api.get('/admin/audit-logs');
        return response.data;
    },

    // Get audit logs filtered by action type
    getAuditLogsByAction: async (action) => {
        const response = await api.get(`/admin/audit-logs/action/${action}`);
        return response.data;
    },

    // Get audit logs for a specific user
    getAuditLogsByUser: async (username) => {
        const response = await api.get(`/admin/audit-logs/user/${username}`);
        return response.data;
    },

    // Get system statistics for admin dashboard
    getSystemStats: async () => {
        // Fetch multiple data sources in parallel for efficiency
        const [users, pokemons, auditLogs] = await Promise.all([
            api.get('/admin/users'),
            api.get('/admin/pokemons?page=0&size=1'), // Just to get total count
            api.get('/admin/audit-logs')
        ]);

        // Calculate user status breakdown
        const userList = users.data;
        return {
            totalUsers: userList.length,
            totalPokemons: 151, // Gen1 has 151 fixed Pokemon
            totalAuditLogs: auditLogs.data.length,
            activeUsers: userList.filter(u => u.status === 'ACTIVE').length,
            bannedUsers: userList.filter(u => u.status === 'BANNED').length,
            suspendedUsers: userList.filter(u => u.status === 'SUSPENDED').length,
            adminUsers: userList.filter(u => u.role === 'ADMIN').length,
        };
    }
};