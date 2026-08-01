/**
 * Validation utilities for Movie Collection Web App
 */

/**
 * Validates whether an email string is formatted correctly.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates collection name.
 * - Must not be empty
 * - Must NOT contain special characters (only alphanumeric characters and spaces are allowed)
 */
export function isValidCollectionName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length === 0) return false;
  // Only alphanumeric characters and spaces
  const allowedRegex = /^[a-zA-Z0-9 ]+$/;
  return allowedRegex.test(trimmed);
}

/**
 * Checks if a collection name already exists in a user's collection list (case-insensitive check).
 */
export function isUniqueCollectionName(
  newCollectionName: string,
  existingCollectionNames: string[],
  currentCollectionId?: string,
  existingCollections?: { id: string; name: string }[]
): boolean {
  const normalizedNew = newCollectionName.trim().toLowerCase();
  
  if (existingCollections && currentCollectionId) {
    return !existingCollections.some(
      (col) => col.id !== currentCollectionId && col.name.trim().toLowerCase() === normalizedNew
    );
  }

  return !existingCollectionNames.some(
    (name) => name.trim().toLowerCase() === normalizedNew
  );
}

/**
 * Validates user age for registration if required
 */
export function isValidPasswordMatch(pass: string, confirmPass: string): boolean {
  return pass === confirmPass && pass.length > 0;
}
