import { AUTH_REDIRECT_PATH_KEY as KEY } from "coral-framework/helpers/storageKeys";

try {
  // Pull the redirection
  const redirectBackTo = localStorage.getItem(KEY);
  if (!redirectBackTo) {
    throw new Error(`${KEY} storage key not set`);
  }

  // Remove the redirect URL that we pulled from storage.
  localStorage.removeItem(KEY);

  // Now that we have a valid redirection URL, we should append the current
  // hash that includes the credentials or errors from the callback.
  const redirectBackToWithToken = redirectBackTo + location.hash;

  // Send the user off to the redirection URL.
  location.href = redirectBackToWithToken;
} catch (err) {
  // Place the error message right into the document body.
  document.body.appendChild(document.createTextNode(err.message));
}
