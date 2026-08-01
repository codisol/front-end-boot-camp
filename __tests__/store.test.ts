import {
  getMovies,
  addMovie,
  deleteMovie,
  createCollection,
  getCollections,
  removeMovieFromCollection,
} from '../lib/store';

describe('Store Operations & Cascade Deletion', () => {
  beforeEach(() => {
    // Clear localStorage mock
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  test('getMovies returns initial seed dataset', () => {
    const movies = getMovies();
    expect(movies.length).toBeGreaterThanOrEqual(10);
    expect(movies[0]).toHaveProperty('title');
    expect(movies[0]).toHaveProperty('banner');
  });

  test('addMovie inserts a new movie into catalog', () => {
    const newMovie = addMovie({
      title: 'Unit Test Movie',
      banner: 'https://example.com/poster.jpg',
      description: 'A test movie description',
      duration: '1h 30m',
      genres: ['Sci-Fi'],
      rating: 8.5,
      releaseYear: 2024,
      director: 'Test Director',
    });

    expect(newMovie.id).toBeDefined();
    const movies = getMovies();
    expect(movies.some((m) => m.id === newMovie.id)).toBe(true);
  });

  test('createCollection enforces unique name & special character check', () => {
    const res1 = createCollection('test-user-1', 'My Favorites');
    expect(res1.success).toBe(true);

    // Duplicate name
    const res2 = createCollection('test-user-1', 'My Favorites');
    expect(res2.success).toBe(false);
    expect(res2.error).toContain('unique');

    // Special characters name
    const res3 = createCollection('test-user-1', 'My Favorites!');
    expect(res3.success).toBe(false);
    expect(res3.error).toContain('special characters');
  });

  test('deleteMovie performs cascade deletion from user collections', () => {
    const movies = getMovies();
    const targetMovie = movies[0];

    // Create collection with targetMovie
    const colRes = createCollection('user-1', 'Cascade Test Col', [targetMovie.id]);
    expect(colRes.success).toBe(true);
    const colId = colRes.collection!.id;

    // Verify movie is in collection
    let cols = getCollections('user-1');
    const targetCol = cols.find((c) => c.id === colId);
    expect(targetCol?.movieIds).toContain(targetMovie.id);

    // Delete movie from catalog
    deleteMovie(targetMovie.id);

    // Verify movie is removed from catalog AND from collection
    const updatedMovies = getMovies();
    expect(updatedMovies.some((m) => m.id === targetMovie.id)).toBe(false);

    cols = getCollections('user-1');
    const updatedCol = cols.find((c) => c.id === colId);
    expect(updatedCol?.movieIds).not.toContain(targetMovie.id);
  });
});
