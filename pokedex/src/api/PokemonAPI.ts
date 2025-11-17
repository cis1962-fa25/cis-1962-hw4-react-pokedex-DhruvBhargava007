import type {
  Pokemon,
  BoxEntry,
  InsertBoxEntry,
  UpdateBoxEntry,
} from '../types/types';

class PokemonAPI {
  private baseUrl = 'https://hw4.cis1962.esinx.net/api';
  private token: string | null = null;
  private readonly MAX_POKEMON_ID = 874;

  // Set the JWT token for authenticated requests
  setToken(token: string) {
    this.token = token;
  }

  // Get headers with optional authentication
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Handle API errors
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Pokemon endpoints (no auth required)
  async listPokemon(limit: number, offset: number): Promise<Pokemon[]> {
    // Ensure we don't fetch beyond ID 874
    if (offset >= this.MAX_POKEMON_ID) {
      return [];
    }

    // Adjust limit if it would exceed MAX_POKEMON_ID
    const adjustedLimit = Math.min(limit, this.MAX_POKEMON_ID - offset);

    const response = await fetch(
      `${this.baseUrl}/pokemon/?limit=${adjustedLimit}&offset=${offset}`,
    );
    return this.handleResponse<Pokemon[]>(response);
  }

  async getPokemonByName(name: string): Promise<Pokemon> {
    const response = await fetch(`${this.baseUrl}/pokemon/${name}`);
    return this.handleResponse<Pokemon>(response);
  }

  // Box endpoints (auth required)
  async listBoxEntries(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/box/`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse<string[]>(response);
  }

  async createBoxEntry(entry: InsertBoxEntry): Promise<BoxEntry> {
    const response = await fetch(`${this.baseUrl}/box/`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(entry),
    });
    return this.handleResponse<BoxEntry>(response);
  }

  async getBoxEntry(id: string): Promise<BoxEntry> {
    const response = await fetch(`${this.baseUrl}/box/${id}`, {
      headers: this.getHeaders(true),
    });
    return this.handleResponse<BoxEntry>(response);
  }

  async updateBoxEntry(id: string, updates: UpdateBoxEntry): Promise<BoxEntry> {
    const response = await fetch(`${this.baseUrl}/box/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(updates),
    });
    return this.handleResponse<BoxEntry>(response);
  }

  async deleteBoxEntry(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/box/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<void>(response);
  }

  async clearAllBoxEntries(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/box/`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<void>(response);
  }

  getMaxPokemonId(): number {
    return this.MAX_POKEMON_ID;
  }
}

// Export a singleton instance
export const pokemonAPI = new PokemonAPI();
