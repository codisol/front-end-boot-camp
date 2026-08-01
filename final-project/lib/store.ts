import { Movie, Collection, UserAccount, INITIAL_MOVIES, DEFAULT_ADMIN, DEFAULT_USER } from './seedData';
import { isValidCollectionName, isUniqueCollectionName } from './validation';

const STORAGE_KEYS = {
  MOVIES: 'movie_app_movies_v1',
  COLLECTIONS: 'movie_app_collections_v1',
  USERS: 'movie_app_users_v1',
  CURRENT_USER: 'movie_app_current_user_v1',
};

// Helper for local storage access in SSR safe environment
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to set localStorage key:', key, err);
  }
}

// Initializer to ensure seed movies exist
export function initStore() {
  if (typeof window === 'undefined') return;
  
  const existingMovies = getStorageItem<Movie[]>(STORAGE_KEYS.MOVIES, []);
  if (existingMovies.length === 0) {
    setStorageItem(STORAGE_KEYS.MOVIES, INITIAL_MOVIES);
  }

  const existingUsers = getStorageItem<UserAccount[]>(STORAGE_KEYS.USERS, []);
  if (existingUsers.length === 0) {
    setStorageItem(STORAGE_KEYS.USERS, [DEFAULT_ADMIN, DEFAULT_USER]);
  }
}

// ----------------- MOVIE STORE ----------------- //

export function getMovies(): Movie[] {
  initStore();
  return getStorageItem<Movie[]>(STORAGE_KEYS.MOVIES, INITIAL_MOVIES);
}

export function getMovieById(id: string): Movie | undefined {
  const movies = getMovies();
  return movies.find((m) => m.id === id);
}

export function addMovie(movieData: Omit<Movie, 'id' | 'createdAt'>): Movie {
  const movies = getMovies();
  const newMovie: Movie = {
    ...movieData,
    id: `movie-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newMovie, ...movies];
  setStorageItem(STORAGE_KEYS.MOVIES, updated);
  return newMovie;
}

export function deleteMovie(movieId: string): void {
  const movies = getMovies();
  const updatedMovies = movies.filter((m) => m.id !== movieId);
  setStorageItem(STORAGE_KEYS.MOVIES, updatedMovies);

  // CASCADE DELETE: Remove movie from all user collections automatically
  const collections = getStorageItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
  const updatedCollections = collections.map((col) => ({
    ...col,
    movieIds: col.movieIds.filter((id) => id !== movieId),
  }));
  setStorageItem(STORAGE_KEYS.COLLECTIONS, updatedCollections);
}

// ----------------- COLLECTION STORE ----------------- //

export function getCollections(userId?: string): Collection[] {
  initStore();
  const all = getStorageItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
  if (!userId) return all;
  return all.filter((c) => c.userId === userId);
}

export function getCollectionById(id: string): Collection | undefined {
  const all = getStorageItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
  return all.find((c) => c.id === id);
}

export function createCollection(userId: string, name: string, initialMovieIds: string[] = []): { success: boolean; collection?: Collection; error?: string } {
  if (!isValidCollectionName(name)) {
    return { success: false, error: 'Collection name must not contain special characters or be empty.' };
  }

  const userCollections = getCollections(userId);
  const existingNames = userCollections.map((c) => c.name);

  if (!isUniqueCollectionName(name, existingNames)) {
    return { success: false, error: 'Collection name must be unique.' };
  }

  const newCol: Collection = {
    id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    name: name.trim(),
    movieIds: Array.from(new Set(initialMovieIds)),
    createdAt: new Date().toISOString(),
  };

  const allCollections = getStorageItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
  setStorageItem(STORAGE_KEYS.COLLECTIONS, [...allCollections, newCol]);

  return { success: true, collection: newCol };
}

export function updateCollectionName(collectionId: string, newName: string): { success: boolean; error?: string } {
  if (!isValidCollectionName(newName)) {
    return { success: false, error: 'Collection name must not contain special characters or be empty.' };
  }

  const allCollections = getStorageItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
  const colIndex = allCollections.findIndex((c) => c.id === collectionId);
  if (colIndex === -1) return { success: false, error: 'Collection not found.' };

  const targetCol = allCollections[colIndex];
  const userCols = allCollections.filter((c) => c.userId === targetCol.userId);

  if (!isUniqueCollectionName(newName, [], collectionId, userCols)) {
    return { success: false, error: 'Collection name must be unique.' };
  }

  allCollections[colIndex].name = newName.trim();
  setStorageItem(STORAGE_KEYS.COLLECTIONS, allCollections);

  return { success: true };
}

export function addMoviesToCollection(collectionId: string, movieIds: string[]): { success: boolean; error?: string } {
  const allCollections = getStorageItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
  const colIndex = allCollections.findIndex((c) => c.id === collectionId);
  if (colIndex === -1) return { success: false, error: 'Collection not found.' };

  const currentMovieIds = allCollections[colIndex].movieIds || [];
  const updatedMovieIds = Array.from(new Set([...currentMovieIds, ...movieIds]));
  allCollections[colIndex].movieIds = updatedMovieIds;

  setStorageItem(STORAGE_KEYS.COLLECTIONS, allCollections);
  return { success: true };
}

export function removeMovieFromCollection(collectionId: string, movieId: string): { success: boolean } {
  const allCollections = getStorageItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
  const colIndex = allCollections.findIndex((c) => c.id === collectionId);
  if (colIndex === -1) return { success: false };

  allCollections[colIndex].movieIds = allCollections[colIndex].movieIds.filter((id) => id !== movieId);
  setStorageItem(STORAGE_KEYS.COLLECTIONS, allCollections);
  return { success: true };
}

export function deleteCollection(collectionId: string): { success: boolean } {
  const allCollections = getStorageItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
  const updated = allCollections.filter((c) => c.id !== collectionId);
  setStorageItem(STORAGE_KEYS.COLLECTIONS, updated);
  return { success: true };
}

export function getCollectionsForMovie(userId: string, movieId: string): Collection[] {
  const userCollections = getCollections(userId);
  return userCollections.filter((c) => c.movieIds.includes(movieId));
}

// ----------------- AUTH STORE ----------------- //

export function getCurrentUser(): UserAccount | null {
  initStore();
  return getStorageItem<UserAccount | null>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
}

export function setCurrentUser(user: UserAccount | null): void {
  setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
}
