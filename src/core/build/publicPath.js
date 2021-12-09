/* eslint-disable no-restricted-globals */
const coralStaticConfig = document.getElementById("coral-static-config");

if (coralStaticConfig) {
  __webpack_public_path__ = JSON.parse(coralStaticConfig.innerText).staticURI;
} else if (window.Coral && window.Coral.getStaticURI) {
  // Set public path for embeds, by getting the public path from the Coral library.
  __webpack_public_path__ = window.Coral.getStaticURI();
} else {
  __webpack_public_path__ = "/";
}
