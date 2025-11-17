import { useState, useEffect } from 'react';
import { PokemonCard } from './PokemonCard';
import { Modal } from './Modal';
import { PokemonDetails } from './PokemonDetails';
import { BoxForm } from './BoxForm';
import { pokemonAPI } from '../api/PokemonAPI';
import type { Pokemon, InsertBoxEntry, UpdateBoxEntry } from '../types/types';

interface PokemonListProps {
  onPokemonAdded: () => void;
}

export function PokemonList({ onPokemonAdded }: PokemonListProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showBoxForm, setShowBoxForm] = useState(false);
  const pageSize = 10;

  const maxPokemonId = pokemonAPI.getMaxPokemonId();
  const totalPages = Math.ceil(maxPokemonId / pageSize);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = currentPage * pageSize;
        const data = await pokemonAPI.listPokemon(pageSize, offset);
        setPokemon(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to fetch Pokemon data',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [currentPage]);

  const handlePokemonClick = async (pokemonName: string) => {
    try {
      const details = await pokemonAPI.getPokemonByName(pokemonName);
      setSelectedPokemon(details);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch Pokemon details',
      );
    }
  };

  const handleAddToBox = () => {
    setShowBoxForm(true);
  };

  const handleBoxFormSubmit = async (
    entry: InsertBoxEntry | UpdateBoxEntry,
  ) => {
    await pokemonAPI.createBoxEntry(entry as InsertBoxEntry);
    setShowBoxForm(false);
    setSelectedPokemon(null);
    onPokemonAdded();
  };

  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(0, page - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages - 1, page + 1));
  };

  return (
    <div className="pokemon-list-container">
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      <div className="pokemon-grid">
        {loading && pokemon.length === 0 ? (
          <div className="loading-container" style={{ gridColumn: '1 / -1' }}>
            <div className="loading-spinner"></div>
            <p>Loading Pokemon...</p>
          </div>
        ) : (
          pokemon.map((p) => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              onClick={() => handlePokemonClick(p.name)}
            />
          ))
        )}
      </div>

      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0 || loading}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1 || loading}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      {selectedPokemon && (
        <Modal
          isOpen={!showBoxForm}
          onClose={() => setSelectedPokemon(null)}
          title=""
        >
          <PokemonDetails
            pokemon={selectedPokemon}
            onAddToBox={handleAddToBox}
          />
        </Modal>
      )}

      {showBoxForm && selectedPokemon && (
        <Modal
          isOpen={showBoxForm}
          onClose={() => setShowBoxForm(false)}
          title=""
        >
          <BoxForm
            pokemonId={selectedPokemon.id}
            pokemonName={selectedPokemon.name}
            onSubmit={handleBoxFormSubmit}
            onCancel={() => setShowBoxForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}
