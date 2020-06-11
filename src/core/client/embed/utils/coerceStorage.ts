import { createInMemoryStorage } from "coral-framework/lib/storage";

function coerceStorage(type: "localStorage" | "sessionStorage"): Storage {
  let storage: Storage;
  try {
    storage = window[type];
  } catch {
    // eslint-disable-next-line no-console
    console.debug(`${type} not available, use in-memory replacement`);

    storage = createInMemoryStorage();
  }

  return storage;
}

export default coerceStorage;
