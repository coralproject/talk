import { getStaticConfiguration } from 'coral-framework/services/staticConfiguration';

// Load the static url from the static configuration, we'll use it to formulate
// the authorized domain to allow the message to be sent to.
const { STATIC_ORIGIN } = getStaticConfiguration();

// Export the origin that will be sent.
export { STATIC_ORIGIN as ORIGIN };

// Scope all the requests made via the messages service.
export const SCOPE = 'client';
