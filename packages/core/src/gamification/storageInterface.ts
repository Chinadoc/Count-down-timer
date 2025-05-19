/**
 * Interface for platform-specific storage services.
 * This will be implemented differently on web (localStorage) and mobile (AsyncStorage).
 */
export interface IStorageService {
  /**
   * Retrieve an item from storage.
   * @param key The key to retrieve.
   * @returns The item, or null if not found.
   */
  getItem<T>(key: string): Promise<T | null>;
  
  /**
   * Save an item to storage.
   * @param key The key to store under.
   * @param value The value to store.
   */
  setItem<T>(key: string, value: T): Promise<void>;
  
  /**
   * Remove an item from storage.
   * @param key The key to remove.
   */
  removeItem(key: string): Promise<void>;
}
