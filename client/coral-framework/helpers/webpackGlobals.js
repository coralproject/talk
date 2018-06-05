/* global __webpack_public_path__, __webpack_nonce__ */ // eslint-disable-line no-unused-vars

import { getStaticConfiguration } from 'coral-framework/services/staticConfiguration';

// Load the static url from the static configuration.
const { STATIC_URL, SCRIPT_NONCE } = getStaticConfiguration();

// Update the static url for the imported public path so dynamically imported
// chunks will use the correct path as defined by the process.env.STATIC_URL
// that is provided dynamically from the template. This is a better solution to
// embedding the environment variables as changes won't require recompilation.
//
// The __webpack_public_path__ can be referenced:
// https://webpack.js.org/configuration/output/#output-publicpath
//
__webpack_public_path__ = STATIC_URL + 'static/';

// All dynamically included scripts that support nonce's will add this to their
// script tags.
//
// The __webpack_nonce__ can be referenced: https://webpack.js.org/guides/csp/
//
// Pending issues:
// - https://github.com/webpack-contrib/style-loader/pull/319
//
__webpack_nonce__ = SCRIPT_NONCE;
