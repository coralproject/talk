/* global __webpack_public_path__ */ // eslint-disable-line no-unused-vars

import { STATIC_URL } from 'coral-framework/constants/config';

// Update the static url for the imported public path so dynamically imported
// chunks will use the correct path as defined by the process.env.STATIC_URL
// that is provided dynamically from the template. This is a better solution to
// embedding the environment variables as changes won't require recompilation.
//
// The __webpack_public_path__ can be referenced:
// https://webpack.js.org/configuration/output/#output-publicpath
//
__webpack_public_path__ = STATIC_URL + 'static/';
