export interface Storage {
  /**
   * value = storage[key]
   */
  getItem(key: string): Promise<string | null> | string | null;
  /**
   * delete storage[key]
   */
  removeItem(key: string): Promise<void> | void;
  /**
   * storage[key] = value
   */
  setItem(key: string, value: string): Promise<void> | void;
}
