import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import soundService from './services/soundService';

// Layout Components
import Navbar from './components/common/Navbar';
import FloatingButtons from './components/common/FloatingButtons';
import LoadingSpinner from './components/common/LoadingSpinner';
import BackgroundWithPokemon from './components/common/BackgroundWithPokemon';

// Landing & Auth Components
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';

// Dashboard Components
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Pokedex Components
import PokedexGrid from './components/pokedex/PokedexGrid';
import PokemonDetail from './components/pokedex/PokemonDetail';

// User Components
import UserProfile from './components/user/UserProfile';
import UserCollection from './components/user/UserCollection';
import Leaderboard from './components/user/Leaderboard';

// Battle Component
import BattleSimulator from './components/battle/BattleSimulator';

// Map Component
import RegionMap from './components/map/RegionMap';

// Admin Components
import AdminUsers from './components/admin/AdminUsers';
import AdminPokemonManager from './components/admin/AdminPokemonManager';
import AdminAuditLogs from './components/admin/AdminAuditLogs';

// Component to handle background music based on route
const MusicController = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Landing page music is handled in LandingPage component
    if (location.pathname === '/') return;

    // For protected routes (when user is logged in), play game music
    if (user && soundService.startGameMusic) {
      soundService.startGameMusic();
    }

    return () => { };
  }, [location.pathname, user]);

  return null;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, userProfile } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && (!userProfile || userProfile.role !== 'ADMIN')) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function AppContent() {
  const { user, userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'ADMIN';

  return (
    <div className="min-h-screen">
      <MusicController />
      {user && <Navbar />}
      {user && <FloatingButtons />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes with BackgroundWithPokemon */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <BackgroundWithPokemon>
              {isAdmin ? <AdminDashboard /> : <UserDashboard />}
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/pokedex" element={
          <ProtectedRoute>
            <BackgroundWithPokemon>
              <PokedexGrid />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/pokemon/:id" element={
          <ProtectedRoute>
            <BackgroundWithPokemon>
              <PokemonDetail />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/profile/:username" element={
          <ProtectedRoute>
            <BackgroundWithPokemon>
              <UserProfile />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/collection/:username" element={
          <ProtectedRoute>
            <BackgroundWithPokemon>
              <UserCollection />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <BackgroundWithPokemon>
              <Leaderboard />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/battle" element={
          <ProtectedRoute>
            <BackgroundWithPokemon>
              <BattleSimulator />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/map" element={
          <ProtectedRoute>
            <BackgroundWithPokemon>
              <RegionMap />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <BackgroundWithPokemon>
              <AdminDashboard />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute adminOnly={true}>
            <BackgroundWithPokemon>
              <AdminUsers />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/admin/pokemons" element={
          <ProtectedRoute adminOnly={true}>
            <BackgroundWithPokemon>
              <AdminPokemonManager />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="/admin/audit-logs" element={
          <ProtectedRoute adminOnly={true}>
            <BackgroundWithPokemon>
              <AdminAuditLogs />
            </BackgroundWithPokemon>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;