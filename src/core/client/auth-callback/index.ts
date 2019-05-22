import { authRedirectBackTo as key } from "coral-framework/helpers/storageKeys";

try {
  // Pull the redirection
  const value = sessionStorage.getItem(key);
  if (!value) {
    throw new Error(`${key} session storage key not set`);
  }

  if (process.env.NODE_ENV === "production") {
    // Remove the redirect URL that we pulled from sessionStorage.
    sessionStorage.removeItem(key);
  }

  // Parse the URL from the redirect parameter, and pull out the pathname.
  const parser = document.createElement("a");
  parser.href = value;

  const redirectBackTo = parser.pathname + parser.search;
  if (!redirectBackTo) {
    throw new Error(`url stored in the ${key} session storage key was invalid`);
  }

  if (process.env.NODE_ENV !== "production") {
    // Remove the redirect URL that we pulled from sessionStorage.
    sessionStorage.removeItem(key);
  }

  // Now that we have a valid redirection URL, we should append the current
  // hash that includes the credentials or errors from the callback.
  const redirectBackToWithToken = redirectBackTo + location.hash;

  // Send the user off to the redirection URL.
  location.href = redirectBackToWithToken;
} catch (err) {
  // Place the error message right into the document body.
  document.body.appendChild(document.createTextNode(err.message));
}
