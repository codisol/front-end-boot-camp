import {
  isValidEmail,
  isValidCollectionName,
  isUniqueCollectionName,
  isValidPasswordMatch,
} from '../lib/validation';

describe('Validation Helpers', () => {
  describe('isValidEmail', () => {
    test('returns true for valid email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('admin.test@domain.co.id')).toBe(true);
    });

    test('returns false for invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidCollectionName', () => {
    test('returns true for valid alphanumeric collection names with spaces', () => {
      expect(isValidCollectionName('SciFi Classics')).toBe(true);
      expect(isValidCollectionName('Favorites 2024')).toBe(true);
      expect(isValidCollectionName('Marvel')).toBe(true);
    });

    test('returns false if name contains special characters', () => {
      expect(isValidCollectionName('Sci-Fi Classics!')).toBe(false);
      expect(isValidCollectionName('Best Movies @2024')).toBe(false);
      expect(isValidCollectionName('Collection #1')).toBe(false);
      expect(isValidCollectionName('Action & Adventure')).toBe(false);
    });

    test('returns false for empty or whitespace-only names', () => {
      expect(isValidCollectionName('')).toBe(false);
      expect(isValidCollectionName('   ')).toBe(false);
    });
  });

  describe('isUniqueCollectionName', () => {
    const existing = ['Action', 'Sci-Fi Hits', 'Drama'];

    test('returns true if collection name is unique', () => {
      expect(isUniqueCollectionName('Horror', existing)).toBe(true);
    });

    test('returns false case-insensitively if name already exists', () => {
      expect(isUniqueCollectionName('action', existing)).toBe(false);
      expect(isUniqueCollectionName('Sci-Fi Hits', existing)).toBe(false);
    });
  });

  describe('isValidPasswordMatch', () => {
    test('returns true when passwords match', () => {
      expect(isValidPasswordMatch('secret123', 'secret123')).toBe(true);
    });

    test('returns false when passwords do not match or are empty', () => {
      expect(isValidPasswordMatch('secret123', 'different')).toBe(false);
      expect(isValidPasswordMatch('', '')).toBe(false);
    });
  });
});
