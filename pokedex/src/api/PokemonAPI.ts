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
      console.error(
        `[PokemonAPI] Request failed: ${response.status} ${response.statusText}`,
        errorData,
      );
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      console.log('[PokemonAPI] Received 204 No Content response');
      return undefined as T;
    }

    const text = await response.text();
    if (!text) {
      console.log('[PokemonAPI] Received empty response body');
      return undefined as T;
    }

    try {
      return JSON.parse(text);
    } catch {
      console.error('[PokemonAPI] Failed to parse JSON response:', text);
      throw new Error('Invalid JSON response from server');
    }
  }

  // Pokemon endpoints (no auth required)
  async listPokemon(limit: number, offset: number): Promise<Pokemon[]> {
    // Ensure we don't fetch beyond ID 874
    if (offset >= this.MAX_POKEMON_ID) {
      console.log(
        '[PokemonAPI] Offset exceeds max Pokemon ID, returning empty array',
      );
      return [];
    }

    // Adjust limit if it would exceed MAX_POKEMON_ID
    const adjustedLimit = Math.min(limit, this.MAX_POKEMON_ID - offset);

    const url = `${this.baseUrl}/pokemon/?limit=${adjustedLimit}&offset=${offset}`;
    console.log(
      `[PokemonAPI] Fetching Pokemon: limit=${adjustedLimit}, offset=${offset}`,
    );
    console.log(`[PokemonAPI] Request URL: ${url}`);

    const startTime = performance.now();
    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      const endTime = performance.now();
      console.error(
        `[PokemonAPI] Network error after ${(endTime - startTime).toFixed(2)}ms:`,
        error,
      );
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(
          'Unable to connect to the server. Please check your internet connection or try again later.',
        );
      }
      throw error;
    }
    const endTime = performance.now();

    const data = await this.handleResponse<Pokemon[]>(response);
    console.log(
      `[PokemonAPI] Received ${data.length} Pokemon in ${(endTime - startTime).toFixed(2)}ms`,
    );
    if (data.length > 0) {
      console.log(
        `[PokemonAPI] Pokemon range: ${data[0].name} (#${data[0].id}) to ${data[data.length - 1].name} (#${data[data.length - 1].id})`,
      );
    }

    return data;
  }

  async getPokemonByName(name: string): Promise<Pokemon> {
    const url = `${this.baseUrl}/pokemon/${name}`;
    console.log(`[PokemonAPI] Fetching Pokemon details: ${name}`);
    console.log(`[PokemonAPI] Request URL: ${url}`);

    const startTime = performance.now();
    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      const endTime = performance.now();
      console.error(
        `[PokemonAPI] Network error after ${(endTime - startTime).toFixed(2)}ms:`,
        error,
      );
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(
          'Unable to connect to the server. Please check your internet connection or try again later.',
        );
      }
      throw error;
    }
    const endTime = performance.now();

    const data = await this.handleResponse<Pokemon>(response);
    console.log(
      `[PokemonAPI] Received Pokemon details for ${name} in ${(endTime - startTime).toFixed(2)}ms`,
    );

    return data;
  }

  // Box endpoints (auth required)
  async listBoxEntries(): Promise<string[]> {
    const url = `${this.baseUrl}/box/`;
    console.log('[PokemonAPI] Listing box entries');
    console.log('[PokemonAPI] Request URL:', url);
    console.log('[PokemonAPI] Has token:', !!this.token);

    const response = await fetch(url, {
      headers: this.getHeaders(true),
    });
    const data = await this.handleResponse<string[]>(response);
    console.log('[PokemonAPI] Retrieved', data.length, 'box entry IDs');
    return data;
  }

  async createBoxEntry(entry: InsertBoxEntry): Promise<BoxEntry> {
    const url = `${this.baseUrl}/box/`;
    console.log('[PokemonAPI] Creating box entry');
    console.log('[PokemonAPI] Request URL:', url);
    console.log('[PokemonAPI] Entry data:', entry);
    console.log('[PokemonAPI] Has token:', !!this.token);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(entry),
    });
    const data = await this.handleResponse<BoxEntry>(response);
    console.log('[PokemonAPI] Created box entry with ID:', data.id);
    return data;
  }

  async getBoxEntry(id: string): Promise<BoxEntry> {
    const url = `${this.baseUrl}/box/${id}`;
    console.log('[PokemonAPI] Getting box entry:', id);
    console.log('[PokemonAPI] Request URL:', url);

    const response = await fetch(url, {
      headers: this.getHeaders(true),
    });
    const data = await this.handleResponse<BoxEntry>(response);
    console.log(
      '[PokemonAPI] Retrieved box entry for Pokemon ID:',
      data.pokemonId,
    );
    return data;
  }

  async updateBoxEntry(id: string, updates: UpdateBoxEntry): Promise<BoxEntry> {
    const url = `${this.baseUrl}/box/${id}`;
    console.log('[PokemonAPI] Updating box entry:', id);
    console.log('[PokemonAPI] Request URL:', url);
    console.log('[PokemonAPI] Updates:', updates);

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(updates),
    });
    const data = await this.handleResponse<BoxEntry>(response);
    console.log('[PokemonAPI] Updated box entry successfully');
    return data;
  }

  async deleteBoxEntry(id: string): Promise<void> {
    const url = `${this.baseUrl}/box/${id}`;
    console.log('[PokemonAPI] Deleting box entry:', id);
    console.log('[PokemonAPI] Request URL:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    await this.handleResponse<void>(response);
    console.log('[PokemonAPI] Deleted box entry successfully');
  }

  async clearAllBoxEntries(): Promise<void> {
    const url = `${this.baseUrl}/box/`;
    console.log('[PokemonAPI] Clearing all box entries');
    console.log('[PokemonAPI] Request URL:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    await this.handleResponse<void>(response);
    console.log('[PokemonAPI] Cleared all box entries successfully');
  }

  getMaxPokemonId(): number {
    return this.MAX_POKEMON_ID;
  }
}

// Export a singleton instance
export const pokemonAPI = new PokemonAPI();
