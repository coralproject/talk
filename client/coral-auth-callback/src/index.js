import { HANDLE_SUCCESSFUL_LOGIN } from 'coral-framework/constants/auth';
import { getStaticConfiguration } from 'coral-framework/services/staticConfiguration';
import { createPostMessage } from 'coral-framework/services/postMessage';

document.addEventListener('DOMContentLoaded', () => {
  const staticConfig = getStaticConfiguration();
  const { BASE_ORIGIN: origin } = staticConfig;
  const postMessage = createPostMessage(origin);

  // Get the auth element and parse it as JSON by decoding it.
  const auth = document.getElementById('auth');
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = auth.innerText;

  // Auth state is contained within the node.
  const { err, data } = JSON.parse(doc.body.textContent);
  if (err) {
    const errDiv = document.createElement('div');
    if (err.message) {
      errDiv.innerText = `${err.name}: ${err.message}`;
    } else {
      errDiv.innerText = JSON.stringify(err);
    }
    document.body.appendChild(errDiv);
    throw err;
  }

  // The data will contain a user and a token.
  const { user, token } = data;

  // Send the state back.
  postMessage.post(HANDLE_SUCCESSFUL_LOGIN, { user, token });

  // Close the window when all went well.
  setTimeout(() => {
    window.close();
  }, 50);
});
