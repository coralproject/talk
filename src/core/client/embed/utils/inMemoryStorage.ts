class InMemoryStorage implements Storage {
  private readonly data = new Map<string, string>();

  public get length() {
    return this.data.size;
  }

  public clear() {
    this.data.clear();
  }

  public key(n: number) {
    const keys = [...this.data.keys()];
    if (keys.length < n || n < 0) {
      return null;
    }

    return keys[n];
  }

  public getItem(key: string): string | null {
    return this.data.get(key) || null;
  }

  public removeItem(key: string): void {
    this.data.delete(key);
  }

  public setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

export default InMemoryStorage;
