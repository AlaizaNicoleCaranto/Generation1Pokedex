import api from './api';

// Authentication service - handles all user auth operations
export const authService = {
    // Login user - receives JWT token on successful authentication
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            // Store auth data in localStorage for persistence across page reloads
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
        }
        return response.data;
    },

    // Register new user - automatically gets a random starter Pokemon
    register: async (username, password, email) => {
        const response = await api.post('/users/register', { username, password, email });
        return response.data;
    },

    // Request password reset email
    forgotPassword: async (email) => {
        return api.post('/auth/forgot-password', { email });
    },

    // Reset password using token from email
    resetPassword: async (token, newPassword) => {
        return api.post('/auth/reset-password', { token, newPassword });
    },

    // Change password for authenticated user
    changePassword: async (username, currentPassword, newPassword) => {
        return api.post('/auth/change-password', { username, currentPassword, newPassword });
    },

    // Logout - clear all stored auth data
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        
        // Clear all cached avatar data from previous sessions
        // This prevents old avatars from showing when switching accounts
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('avatar_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    },

    // Check if user has a valid token stored
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Get current logged-in username
    getCurrentUser: () => {
        return localStorage.getItem('username');
    },

    // Store user role for admin checks
    setUserRole: (role) => {
        localStorage.setItem('role', role);
    },

    // Get user role
    getUserRole: () => {
        return localStorage.getItem('role');
    }
};