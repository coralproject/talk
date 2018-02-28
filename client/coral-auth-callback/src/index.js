import { HANDLE_SUCCESSFUL_LOGIN } from 'coral-framework/constants/auth';
import { getStaticConfiguration } from 'coral-framework/services/staticConfiguration';
import { createPostMessage } from 'coral-framework/services/postMessage';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const staticConfig = getStaticConfiguration();
    const { STATIC_ORIGIN: origin } = staticConfig;
    const postMessage = createPostMessage(origin);

    // Get the auth element and parse it as JSON by decoding it.
    const auth = document.getElementById('auth');
    const doc = document.implementation.createHTMLDocument('');
    doc.body.innerHTML = auth.innerText;

    // Auth state is contained within the node.
    const { err, data } = JSON.parse(doc.body.textContent);
    if (err) {
      // TODO: send back the error message.
      console.error(err);
    } else {
      // The data will contain a user and a token.
      const { user, token } = data;

      // Send the state back.
      postMessage.post(HANDLE_SUCCESSFUL_LOGIN, { user, token });
    }
  } finally {
    // Always close the window.
    setTimeout(() => {
      window.close();
    }, 50);
  }
});
