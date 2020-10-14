import { NetworkOfflineError } from "../errors";

// assertOnline makes sure that we are online, and throws `NetworkOfflineError` otherwise.
export default function assertOnline(error: Error) {
  if (
    navigator.onLine === false ||
    (error.name === "TypeError" && error.message === "Failed to fetch")
  ) {
    throw new NetworkOfflineError(error);
  }
}
