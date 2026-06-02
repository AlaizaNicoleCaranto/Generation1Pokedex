import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

// Auth context for managing global authentication state
// Provides user data, profile, and auth methods throughout the app
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);        // Basic user info (username)
    const [userProfile, setUserProfile] = useState(null); // Full user profile with stats
    const [loading, setLoading] = useState(true);   // Loading state for initial auth check

    // Check authentication status when app loads
    useEffect(() => {
        const checkAuth = async () => {
            if (authService.isAuthenticated()) {
                const username = authService.getCurrentUser();
                setUser({ username });

                // Fetch full user profile including stats and badges
                try {
                    const profile = await userService.getProfile(username);
                    setUserProfile(profile);
                    authService.setUserRole(profile.role);
                } catch (err) {
                    console.error('Failed to fetch user profile:', err);
                    // If profile fetch fails, token might be invalid
                    authService.logout();
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Login handler - authenticates user and loads profile
    const login = async (username, password) => {
        // Submit credentials to backend, receive JWT token on success
        const data = await authService.login(username, password);
        setUser({ username: data.username });

        // Fetch profile after successful login
        const profile = await userService.getProfile(username);
        setUserProfile(profile);
        authService.setUserRole(profile.role);

        return data;
    };

    // Logout handler - clears all auth state
    const logout = () => {
        authService.logout();
        setUser(null);
        setUserProfile(null);
    };

    // Register handler - creates new user account
    const register = async (username, password, email) => {
        const data = await authService.register(username, password, email);
        return data;
    };

    // Refresh user profile (used after catching Pokemon, etc.)
    const refreshProfile = async () => {
        if (user?.username) {
            const profile = await userService.getProfile(user.username);
            setUserProfile(profile);
            return profile;
        }
        return null;
    };

    return (
        <AuthContext.Provider value={{
            user,           // Basic user info
            userProfile,    // Full profile with stats
            loading,        // Loading state
            login,          // Login function
            logout,         // Logout function
            register,       // Register function
            refreshProfile  // Refresh profile data
        }}>
            {children}
        </AuthContext.Provider>
    );
};