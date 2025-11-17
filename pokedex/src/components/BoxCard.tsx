import type { BoxEntry, Pokemon } from '../types/types';

interface BoxCardProps {
  entry: BoxEntry;
  pokemon: Pokemon;
  onEdit: (entry: BoxEntry) => void;
  onDelete: (id: string) => void;
}

export function BoxCard({ entry, pokemon, onEdit, onDelete }: BoxCardProps) {
  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to release ${pokemon.name} from your box?`,
      )
    ) {
      onDelete(entry.id);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="box-card">
      <div className="box-card-image">
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      </div>
      <div className="box-card-info">
        <h3 className="box-card-name">
          #{pokemon.id} {pokemon.name}
        </h3>
        <div className="box-card-types">
          {pokemon.types.map((type, index) => (
            <span
              key={index}
              className="pokemon-type-badge"
              style={{ backgroundColor: type.color }}
            >
              {type.name}
            </span>
          ))}
        </div>
        <div className="box-card-details">
          <p>
            <strong>Level:</strong> {entry.level}
          </p>
          <p>
            <strong>Location:</strong> {entry.location}
          </p>
          <p>
            <strong>Caught:</strong> {formatDate(entry.createdAt)}
          </p>
          {entry.notes && (
            <p className="box-card-notes">
              <strong>Notes:</strong> {entry.notes}
            </p>
          )}
        </div>
      </div>
      <div className="box-card-actions">
        <button className="button-edit" onClick={() => onEdit(entry)}>
          Edit
        </button>
        <button className="button-delete" onClick={handleDelete}>
          Release
        </button>
      </div>
    </div>
  );
}
