import axios from 'axios';

// Base API configuration for backend communication
// Backend runs on port 8080 by default
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout for requests
});

// Request interceptor - automatically adds JWT token to every request
// This ensures authenticated users can access protected endpoints
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handles common errors globally
// Prevents repetitive error handling in individual components
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 403 Forbidden - user is banned or suspended
        if (error.response?.status === 403) {
            const message = error.response?.data?.message || '';
            if (message.includes('banned') || message.includes('suspended')) {
                // Clear local storage and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                window.location.href = '/login?error=account_blocked';
            }
        }

        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;