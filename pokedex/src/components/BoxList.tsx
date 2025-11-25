import { useState, useEffect, useCallback } from 'react';
import { BoxCard } from './BoxCard';
import { Modal } from './Modal';
import { BoxForm } from './BoxForm';
import { pokemonAPI } from '../api/PokemonAPI';
import type { BoxEntry, Pokemon, UpdateBoxEntry } from '../types/types';

interface BoxListProps {
  pokemonMap: Map<number, string>;
  refreshTrigger: number;
}

export function BoxList({ pokemonMap, refreshTrigger }: BoxListProps) {
  const [boxEntries, setBoxEntries] = useState<
    Array<{ entry: BoxEntry; pokemon: Pokemon }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<BoxEntry | null>(null);

  const fetchBoxEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all box entry IDs
      const entryIds = await pokemonAPI.listBoxEntries();

      // Fetch each box entry and its corresponding pokemon
      const entriesWithPokemon = await Promise.all(
        entryIds.map(async (id) => {
          const entry = await pokemonAPI.getBoxEntry(id);
          let pokemonName = pokemonMap.get(entry.pokemonId);

          // If Pokemon name not in map, calculate the exact batch to fetch
          // Since Pokemon IDs are sequential, we can directly calculate which batch contains the ID
          if (!pokemonName) {
            const batchSize = 10;
            const maxId = pokemonAPI.getMaxPokemonId();

            // Calculate the offset for the batch that contains this Pokemon ID
            // Pokemon IDs are 1-indexed, so ID 150 would be in batch starting at offset 100
            const calculatedOffset =
              Math.floor((entry.pokemonId - 1) / batchSize) * batchSize;

            if (calculatedOffset < maxId) {
              const pokemonList = await pokemonAPI.listPokemon(
                batchSize,
                calculatedOffset,
              );
              const foundPokemon = pokemonList.find(
                (p) => p.id === entry.pokemonId,
              );
              if (foundPokemon) {
                pokemonName = foundPokemon.name;
                // Update the map for future use
                pokemonMap.set(entry.pokemonId, pokemonName);
              }
            }

            if (!pokemonName) {
              throw new Error(`Pokemon with ID ${entry.pokemonId} not found`);
            }
          }

          const pokemon = await pokemonAPI.getPokemonByName(pokemonName);
          return { entry, pokemon };
        }),
      );

      setBoxEntries(entriesWithPokemon);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch box entries',
      );
    } finally {
      setLoading(false);
    }
  }, [pokemonMap]);

  useEffect(() => {
    fetchBoxEntries();
  }, [refreshTrigger, fetchBoxEntries]);

  const handleEdit = (entry: BoxEntry) => {
    setEditingEntry(entry);
  };

  const handleDelete = async (id: string) => {
    try {
      await pokemonAPI.deleteBoxEntry(id);
      await fetchBoxEntries();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete box entry',
      );
    }
  };

  const handleEditSubmit = async (updates: UpdateBoxEntry) => {
    if (!editingEntry) return;

    try {
      await pokemonAPI.updateBoxEntry(editingEntry.id, updates);
      setEditingEntry(null);
      await fetchBoxEntries();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update box entry',
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your Box...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchBoxEntries}>Retry</button>
      </div>
    );
  }

  if (boxEntries.length === 0) {
    return (
      <div className="empty-box">
        <h2>Your Box is Empty</h2>
        <p>Catch some Pokemon to see them here!</p>
      </div>
    );
  }

  return (
    <div className="box-list-container">
      <div className="box-grid">
        {boxEntries.map(({ entry, pokemon }) => (
          <BoxCard
            key={entry.id}
            entry={entry}
            pokemon={pokemon}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editingEntry && (
        <Modal
          isOpen={true}
          onClose={() => setEditingEntry(null)}
          title="Edit Box Entry"
        >
          <BoxForm
            existingEntry={editingEntry}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingEntry(null)}
          />
        </Modal>
      )}
    </div>
  );
}
