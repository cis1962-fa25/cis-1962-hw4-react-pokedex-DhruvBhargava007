import { useState } from 'react';
import type { Pokemon } from '../types/types';

interface PokemonDetailsProps {
  pokemon: Pokemon;
  onAddToBox: () => void;
}

export function PokemonDetails({ pokemon, onAddToBox }: PokemonDetailsProps) {
  const [selectedSprite, setSelectedSprite] = useState<
    'front_default' | 'back_default' | 'front_shiny' | 'back_shiny'
  >('front_default');

  return (
    <div className="pokemon-details">
      <div className="pokemon-details-header">
        <h2>
          #{pokemon.id} {pokemon.name}
        </h2>
        <div className="pokemon-details-types">
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
      </div>

      <div className="pokemon-details-content">
        <div className="pokemon-details-sprite">
          <img
            src={pokemon.sprites[selectedSprite]}
            alt={`${pokemon.name} ${selectedSprite}`}
          />
          <div className="sprite-selector">
            <button
              className={selectedSprite === 'front_default' ? 'active' : ''}
              onClick={() => setSelectedSprite('front_default')}
            >
              Front
            </button>
            <button
              className={selectedSprite === 'back_default' ? 'active' : ''}
              onClick={() => setSelectedSprite('back_default')}
            >
              Back
            </button>
            <button
              className={selectedSprite === 'front_shiny' ? 'active' : ''}
              onClick={() => setSelectedSprite('front_shiny')}
            >
              Shiny Front
            </button>
            <button
              className={selectedSprite === 'back_shiny' ? 'active' : ''}
              onClick={() => setSelectedSprite('back_shiny')}
            >
              Shiny Back
            </button>
          </div>
        </div>

        <div className="pokemon-details-info">
          <div className="pokemon-description">
            <p>{pokemon.description}</p>
          </div>

          <div className="pokemon-stats">
            <h3>Stats</h3>
            <div className="stat-bar">
              <span className="stat-label">HP</span>
              <div className="stat-value-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${(pokemon.stats.hp / 255) * 100}%` }}
                ></div>
              </div>
              <span className="stat-value">{pokemon.stats.hp}</span>
            </div>
            <div className="stat-bar">
              <span className="stat-label">Attack</span>
              <div className="stat-value-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${(pokemon.stats.attack / 255) * 100}%` }}
                ></div>
              </div>
              <span className="stat-value">{pokemon.stats.attack}</span>
            </div>
            <div className="stat-bar">
              <span className="stat-label">Defense</span>
              <div className="stat-value-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${(pokemon.stats.defense / 255) * 100}%` }}
                ></div>
              </div>
              <span className="stat-value">{pokemon.stats.defense}</span>
            </div>
            <div className="stat-bar">
              <span className="stat-label">Sp. Atk</span>
              <div className="stat-value-bar">
                <div
                  className="stat-fill"
                  style={{
                    width: `${(pokemon.stats.specialAttack / 255) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="stat-value">{pokemon.stats.specialAttack}</span>
            </div>
            <div className="stat-bar">
              <span className="stat-label">Sp. Def</span>
              <div className="stat-value-bar">
                <div
                  className="stat-fill"
                  style={{
                    width: `${(pokemon.stats.specialDefense / 255) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="stat-value">{pokemon.stats.specialDefense}</span>
            </div>
            <div className="stat-bar">
              <span className="stat-label">Speed</span>
              <div className="stat-value-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${(pokemon.stats.speed / 255) * 100}%` }}
                ></div>
              </div>
              <span className="stat-value">{pokemon.stats.speed}</span>
            </div>
          </div>

          <div className="pokemon-moves">
            <h3>Moves</h3>
            <div className="moves-list">
              {pokemon.moves.slice(0, 8).map((move, index) => (
                <div key={index} className="move-item">
                  <span className="move-name">{move.name}</span>
                  <span
                    className="move-type"
                    style={{ backgroundColor: move.type.color }}
                  >
                    {move.type.name}
                  </span>
                  {move.power && (
                    <span className="move-power">Power: {move.power}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button className="add-to-box-button" onClick={onAddToBox}>
            Add to Box
          </button>
        </div>
      </div>
    </div>
  );
}
