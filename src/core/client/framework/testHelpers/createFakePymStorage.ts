import { PymStorage } from "talk-framework/lib/storage";

export class FakeStorage implements PymStorage {
  public store: Record<string, string> = {};

  public setItem(key: string, value: string) {
    this.store[key] = value;
    return Promise.resolve();
  }
  public removeItem(key: string) {
    delete this.store[key];
    return Promise.resolve();
  }
  public getItem(key: string) {
    return Promise.resolve(this.store[key]);
  }
}

export default function createFakePymStorage() {
  return new FakeStorage();
}
