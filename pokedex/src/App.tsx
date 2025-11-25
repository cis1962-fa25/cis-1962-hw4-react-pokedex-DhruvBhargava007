import { useState, useEffect } from 'react';
import { PokemonList } from './components/PokemonList';
import { BoxList } from './components/BoxList';
import { pokemonAPI } from './api/PokemonAPI';
import type { Pokemon } from './types/types';
import './App.css';

type View = 'pokemon' | 'box';

function App() {
  const [currentView, setCurrentView] = useState<View>('pokemon');
  const [pokemonMap, setPokemonMap] = useState<Map<number, string>>(new Map());
  const [token, setToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [boxRefreshTrigger, setBoxRefreshTrigger] = useState(0);

  // Build Pokemon ID to name mapping on app load (non-blocking)
  useEffect(() => {
    const buildPokemonMap = async () => {
      console.log('[App] Starting to build Pokemon ID to name mapping...');
      try {
        const map = new Map<number, string>();
        const maxId = pokemonAPI.getMaxPokemonId();
        const batchSize = 10;
        const totalBatches = Math.ceil(maxId / batchSize);

        console.log(
          `[App] Will fetch ${totalBatches} batches of ${batchSize} Pokemon each (max ID: ${maxId})`,
        );

        // Fetch all Pokemon in batches to build the map
        for (
          let batch = 0, offset = 0;
          offset < maxId;
          batch++, offset += batchSize
        ) {
          console.log(
            `[App] Fetching batch ${batch + 1}/${totalBatches} (offset: ${offset})`,
          );
          const pokemon = await pokemonAPI.listPokemon(batchSize, offset);
          pokemon.forEach((p: Pokemon) => {
            map.set(p.id, p.name);
          });
          console.log(
            `[App] Batch ${batch + 1} complete. Map now contains ${map.size} entries.`,
          );
        }

        console.log(
          `[App] Pokemon map building complete! Total entries: ${map.size}`,
        );
        setPokemonMap(map);
      } catch (error) {
        // Don't block the app if map building fails
        console.error('[App] Failed to build Pokemon map:', error);
        // Set a minimal map or empty map - Box features will work with lazy loading
      }
    };

    // Don't block app loading - build map in background
    buildPokemonMap();
  }, []);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      pokemonAPI.setToken(token.trim());
      setIsAuthenticated(true);
    }
  };

  const handlePokemonAdded = () => {
    setBoxRefreshTrigger((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="auth-container">
          <h1>Welcome to Pokedex</h1>
          <p>Please enter your JWT token to access Box features</p>
          <form onSubmit={handleTokenSubmit} className="auth-form">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your JWT token"
              className="token-input"
            />
            <button type="submit" className="button-primary">
              Login
            </button>
          </form>
          <p className="auth-note">
            You can browse Pokemon without authentication, but you need a token
            to catch and store Pokemon in your Box.
          </p>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="button-secondary"
          >
            Browse Without Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokedex</h1>
        <nav className="view-switcher">
          <button
            className={currentView === 'pokemon' ? 'active' : ''}
            onClick={() => setCurrentView('pokemon')}
          >
            All Pokemon
          </button>
          <button
            className={currentView === 'box' ? 'active' : ''}
            onClick={() => setCurrentView('box')}
          >
            My Box
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'pokemon' ? (
          <PokemonList onPokemonAdded={handlePokemonAdded} />
        ) : (
          <BoxList pokemonMap={pokemonMap} refreshTrigger={boxRefreshTrigger} />
        )}
      </main>
    </div>
  );
}

export default App;
