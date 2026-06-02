import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { pokemonService } from '../../services/pokemonService';
import { userService } from '../../services/userService';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import PixelButton from '../common/PixelButton';
import soundService from '../../services/soundService';

const PokemonDetail = () => {
  const { id } = useParams();
  const { user, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catching, setCatching] = useState(false);
  const [message, setMessage] = useState(null);
  const [isCaught, setIsCaught] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [deleting, setDeleting] = useState(false);

  const isAdmin = userProfile?.role === 'ADMIN';

  useEffect(() => {
    loadPokemon();
    if (user) loadUserCollection();
  }, [id, user]);

  const loadPokemon = async () => {
    try {
      setLoading(true);
      const data = await pokemonService.getById(id);
      setPokemon(data);
      setEditForm(data); // Initialize edit form with pokemon data
      soundService.playPokemonCry(data.pokedexNumber);
    } catch (err) {
      setMessage('Failed to load Pokemon details');
    } finally {
      setLoading(false);
    }
  };

  const loadUserCollection = async () => {
    try {
      const collection = await userService.getCollection(user.username);
      setIsCaught(collection.some(p => p.id === parseInt(id)));
    } catch (err) { }
  };

  const handleCatch = async () => {
    try {
      setCatching(true);
      await userService.catchPokemon(user.username, pokemon.id);
      await refreshProfile();
      await loadUserCollection();
      soundService.playCatchSound();
      setMessage(`✨ Congratulations! You caught ${pokemon.name}! ✨`);
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to catch'}`);
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setCatching(false);
    }
  };

  // Admin: Update Pokemon
  const handleUpdate = async () => {
    try {
      setLoading(true);
      await pokemonService.updatePokemon(pokemon.id, editForm);
      setMessage(`✅ ${editForm.name} updated successfully!`);
      await loadPokemon();
      setShowEditModal(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage(`❌ Update failed: ${err.response?.data?.message || 'Unknown error'}`);
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Admin: Delete Pokemon
  const handleDelete = async () => {
    if (!window.confirm(`⚠️ WARNING: Delete ${pokemon.name}? This action cannot be undone! ⚠️`)) {
      return;
    }
    try {
      setDeleting(true);
      await pokemonService.deletePokemon(pokemon.id);
      setMessage(`🗑️ ${pokemon.name} has been deleted.`);
      setTimeout(() => navigate('/pokedex'), 2000);
    } catch (err) {
      setMessage(`❌ Delete failed: ${err.response?.data?.message || 'Unknown error'}`);
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setDeleting(false);
    }
  };

  const getSpriteUrl = () => {
    if (imgError) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.pokedexNumber}.png`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.pokedexNumber}.png`;
  };

  const formattedNumber = `#${String(pokemon?.pokedexNumber).padStart(3, '0')}`;

  // map pokemon type to a color used for headings / accents
  const typeColorMap = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    fairy: '#EE99AC',
    dark: '#705848',
  };
  const primaryType = pokemon?.types?.[0]?.name?.toLowerCase() || 'normal';
  const primaryColor = typeColorMap[primaryType] || '#4ade80';

  if (loading) return <LoadingSpinner fullScreen />;
  if (!pokemon) return <div className="text-center text-pixel-red p-8">Pokemon not found</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="font-pixel text-sm hover:text-retro-green transition-colors">
            ← BACK TO POKEDEX
          </button>

          {/* Admin Action Buttons */}
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-pixel text-xs rounded transition-colors"
              >
                ✏️ EDIT
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1 bg-pixel-red hover:bg-red-700 text-white font-pixel text-xs rounded transition-colors disabled:opacity-50"
              >
                {deleting ? 'DELETING...' : '🗑️ DELETE'}
              </button>
            </div>
          )}
        </div>

        {message && (
          <div className={`mb-4 p-3 text-center font-pixel text-sm ${message.includes('✨') || message.includes('✅') ? 'bg-retro-green/20 border border-retro-green text-retro-green' : 'bg-pixel-red/20 border border-pixel-red text-pixel-red'}`}>
            {message}
          </div>
        )}

          <div className="glass-card p-6 md:p-8">
          <div className="text-center mb-6">
            <span className="font-pixel text-sm text-text-muted">{formattedNumber}</span>
            <h1 className="font-pixel text-2xl md:text-3xl mt-1" style={{ color: primaryColor }}>{pokemon.name}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image with CRY ON HOVER */}
            <div className="text-center">
              <div
                className="bg-cream/80 rounded-xl p-6"
                onMouseEnter={() => soundService.playPokemonCry(pokemon.pokedexNumber)}
              >
                <img
                  src={getSpriteUrl()}
                  alt={pokemon.name}
                  className="w-48 h-48 mx-auto pixelated animate-float"
                  onError={() => setImgError(true)}
                />
              </div>
              <div className="flex justify-center gap-3 mt-4">
                {pokemon.types?.map((type) => (
                  <span key={type.id} className={`px-4 py-1 font-pixel text-sm type-${type.name.toLowerCase()} text-white rounded-full shadow-md`}>
                    {type.name}
                  </span>
                ))}
              </div>
              {!isCaught && user && (
                <PixelButton onClick={handleCatch} disabled={catching} className="mt-6 w-full" variant="success">
                  {catching ? 'CATCHING...' : 'CATCH THIS POKEMON!'}
                </PixelButton>
              )}
              {isCaught && (
                <div className="mt-6 p-3 bg-retro-green/20 border border-retro-green rounded-lg text-center">
                  <p className="font-pixel text-xs text-retro-green-dark">✓ ALREADY CAUGHT</p>
                </div>
              )}
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-4">
              <div className="bg-cream/80 rounded-xl p-4">
                <h3 className="font-pixel text-sm text-text-dark mb-3">PROFILE</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="font-retro text-text-dark">Height</span><span className="font-retro text-text-dark">{pokemon.height} m</span></div>
                  <div className="flex justify-between"><span className="font-retro text-text-dark">Weight</span><span className="font-retro text-text-dark">{pokemon.weight} kg</span></div>
                  <div className="flex justify-between"><span className="font-retro text-text-dark">Habitat</span><span className="font-retro text-text-dark">{pokemon.habitat || 'Unknown'}</span></div>
                  <div className="flex justify-between"><span className="font-retro text-text-dark">Rarity</span>
                    <span className={`font-retro ${pokemon.rarity === 'Legendary' ? 'text-retro-gold' : pokemon.rarity === 'Rare' ? 'text-pixel-blue' : 'text-text-dark'}`}>
                      {pokemon.rarity || 'Common'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-cream/80 rounded-xl p-4">
                <h3 className="font-pixel text-sm text-text-dark mb-3">BASE STATS</h3>
                <div className="space-y-2">
                  <StatBar label="HP" value={pokemon.hp} max={255} color="retro-green" />
                  <StatBar label="ATTACK" value={pokemon.attack} max={255} color="pixel-red" />
                  <StatBar label="DEFENSE" value={pokemon.defense} max={255} color="pixel-blue" />
                  <StatBar label="SP. ATK" value={pokemon.specialAttack} max={255} color="retro-gold" />
                  <StatBar label="SP. DEF" value={pokemon.specialDefense} max={255} color="retro-gold" />
                  <StatBar label="SPEED" value={pokemon.speed} max={255} color="retro-green" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-cream/80 rounded-xl">
            <p className="font-retro text-text-dark">{pokemon.description || `${pokemon.name} is a ${pokemon.types?.map(t => t.name).join('/')}-type Pokemon from the Kanto region.`}</p>
          </div>

          {pokemon.abilities?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-pixel text-sm mb-2" style={{ color: primaryColor }}>ABILITIES</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <span key={ability.id} className="ability-badge px-3 py-1 bg-cream/90 rounded-full font-retro text-sm text-text-dark">{ability.name}</span>
                ))}
              </div>
            </div>
          )}

          {pokemon.evolvesFrom && (
            <div className="mt-4 pt-4 border-t border-cream-dark">
              <p className="font-pixel text-xs text-text-muted">Evolves from: {pokemon.evolvesFrom.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="font-pixel text-lg text-text-dark mb-4">✏️ EDIT POKEMON</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-pixel text-xs text-text-muted mb-1">Pokedex Number</label>
                <input
                  type="number"
                  value={editForm.pokedexNumber || ''}
                  onChange={(e) => setEditForm({ ...editForm, pokedexNumber: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 input-retro"
                />
              </div>
              <div>
                <label className="block font-pixel text-xs text-text-muted mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 input-retro"
                />
              </div>
              <div>
                <label className="block font-pixel text-xs text-text-muted mb-1">HP</label>
                <input
                  type="number"
                  value={editForm.hp || ''}
                  onChange={(e) => setEditForm({ ...editForm, hp: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 input-retro"
                />
              </div>
              <div>
                <label className="block font-pixel text-xs text-text-muted mb-1">Attack</label>
                <input
                  type="number"
                  value={editForm.attack || ''}
                  onChange={(e) => setEditForm({ ...editForm, attack: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 input-retro"
                />
              </div>
              <div>
                <label className="block font-pixel text-xs text-text-muted mb-1">Defense</label>
                <input
                  type="number"
                  value={editForm.defense || ''}
                  onChange={(e) => setEditForm({ ...editForm, defense: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 input-retro"
                />
              </div>
              <div>
                <label className="block font-pixel text-xs text-text-muted mb-1">Speed</label>
                <input
                  type="number"
                  value={editForm.speed || ''}
                  onChange={(e) => setEditForm({ ...editForm, speed: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 input-retro"
                />
              </div>
              <div>
                <label className="block font-pixel text-xs text-text-muted mb-1">Rarity</label>
                <select
                  value={editForm.rarity || 'Common'}
                  onChange={(e) => setEditForm({ ...editForm, rarity: e.target.value })}
                  className="w-full px-3 py-2 input-retro"
                >
                  <option value="Common">Common</option>
                  <option value="Rare">Rare</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>
              <div>
                <label className="block font-pixel text-xs text-text-muted mb-1">Habitat</label>
                <input
                  type="text"
                  value={editForm.habitat || ''}
                  onChange={(e) => setEditForm({ ...editForm, habitat: e.target.value })}
                  className="w-full px-3 py-2 input-retro"
                  placeholder="Forest, Cave, Mountain, etc."
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-pixel text-xs text-text-muted mb-1">Description</label>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 input-retro"
                rows="3"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdate} className="flex-1 btn-primary">SAVE CHANGES</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 btn-secondary">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBar = ({ label, value, max, color }) => {
  const percentage = (value / max) * 100;
  const colorMap = { 'retro-green': '#4ade80', 'pixel-red': '#ef4444', 'pixel-blue': '#3b82f6', 'retro-gold': '#fbbf24' };
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="font-pixel text-[10px] text-text-dark">{label}</span>
        <span className="font-retro text-text-dark">{value}</span>
      </div>
      <div className="w-full bg-cream-dark rounded-full h-2">
        <div className="rounded-full h-2" style={{ width: `${percentage}%`, backgroundColor: colorMap[color] }}></div>
      </div>
    </div>
  );
};

export default PokemonDetail;