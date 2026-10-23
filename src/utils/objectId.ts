import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Checks if a string is a valid 24-character hexadecimal MongoDB ObjectId.
 */
export const isValidMongoId = (id?: string | null): id is string => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id.trim());
};

/**
 * Generates a valid 24-character hexadecimal MongoDB ObjectId string.
 * Format: 8-char hex timestamp (seconds) + 16-char random hex string.
 */
export const generateMongoObjectId = (): string => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomChars = 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );
  return (timestamp + randomChars).toLowerCase();
};

/**
 * Ensures a valid MongoDB ObjectId is returned for API calls.
 * If candidateId is valid, returns it.
 * Otherwise checks AsyncStorage ('user_id').
 * If still invalid, generates a new 24-char hex ObjectId, persists it, and returns it.
 */
export const getValidUserId = async (candidateId?: string | null): Promise<string> => {
  if (candidateId && isValidMongoId(candidateId)) {
    return candidateId.trim();
  }

  try {
    const stored = await AsyncStorage.getItem('user_id');
    if (stored && isValidMongoId(stored)) {
      return stored.trim();
    }
  } catch (e) {
    // ignore storage error
  }

  const newId = generateMongoObjectId();
  try {
    await AsyncStorage.setItem('user_id', newId);
  } catch (e) {
    // ignore storage error
  }
  return newId;
};
