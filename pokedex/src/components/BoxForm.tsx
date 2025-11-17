import { useState } from 'react';
import type { BoxEntry, InsertBoxEntry, UpdateBoxEntry } from '../types/types';

interface BoxFormProps {
  pokemonId?: number;
  pokemonName?: string;
  existingEntry?: BoxEntry;
  onSubmit: (entry: InsertBoxEntry | UpdateBoxEntry) => Promise<void>;
  onCancel: () => void;
}

export function BoxForm({
  pokemonId,
  pokemonName,
  existingEntry,
  onSubmit,
  onCancel,
}: BoxFormProps) {
  const [level, setLevel] = useState<number>(existingEntry?.level ?? 1);
  const [location, setLocation] = useState<string>(
    existingEntry?.location ?? '',
  );
  const [notes, setNotes] = useState<string>(existingEntry?.notes ?? '');
  const [createdAt, setCreatedAt] = useState<string>(
    existingEntry?.createdAt ?? new Date().toISOString(),
  );
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!location.trim()) {
      setError('Location is required');
      return;
    }

    if (level < 1 || level > 100) {
      setError('Level must be between 1 and 100');
      return;
    }

    setIsSubmitting(true);
    try {
      const entry: InsertBoxEntry | UpdateBoxEntry = existingEntry
        ? {
            level,
            location: location.trim(),
            notes: notes.trim() || undefined,
            createdAt,
          }
        : {
            pokemonId: pokemonId!,
            level,
            location: location.trim(),
            notes: notes.trim() || undefined,
            createdAt,
          };

      await onSubmit(entry);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save entry');
      setIsSubmitting(false);
    }
  };

  return (
    <form className="box-form" onSubmit={handleSubmit}>
      <h3>{existingEntry ? 'Edit Box Entry' : `Catch ${pokemonName}`}</h3>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="level">Level *</label>
        <input
          id="level"
          type="number"
          min="1"
          max="100"
          value={level}
          onChange={(e) => setLevel(Number.parseInt(e.target.value))}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Route 1, Viridian Forest"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="createdAt">Catch Date *</label>
        <input
          id="createdAt"
          type="datetime-local"
          value={createdAt.slice(0, 16)}
          onChange={(e) => setCreatedAt(new Date(e.target.value).toISOString())}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this catch..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="button-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : existingEntry ? 'Update' : 'Catch'}
        </button>
      </div>
    </form>
  );
}
