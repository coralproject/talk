/* eslint-disable no-restricted-globals */
import React from "react";
import ReactDOM from "react-dom";

import { parseQuery } from "coral-common/utils";

import { BrowserInfo } from "../lib/browserInfo";

function extractQuery(href: string) {
  const query = href.split("?")[1];
  if (!query) {
    return null;
  }
  // Remove hash and return.
  return query.split("#")[0];
}

/**
 * Injects react-axe for runtime a11y checks under certain conditions:
 *   - During development
 *   - Not on mobile
 *   - `axe` has been added to the url query.
 *
 * @param href url to check for the `axe` property.
 */
export default async function potentiallyInjectAxe(
  href = window.location.href,
  browser: BrowserInfo
) {
  if (process.env.NODE_ENV !== "development" || browser.mobile) {
    // Only in development and skip mobile as it doesn't work there.
    return;
  }
  const query = extractQuery(href);
  if (!query || !("axe" in parseQuery(query))) {
    // Because axe slows down React rendering considerably it is
    // only included when "axe" is set in the url query.
    return;
  }

  // eslint-disable-next-line no-console
  console.debug("injecting react-axe");

  const axe = (await import("react-axe")).default;
  axe(React, ReactDOM, 1000, {
    rules: [
      {
        id: "page-has-heading-one",
        enabled: false,
      },
      {
        id: "html-has-lang",
        // This is injected by the server and irrelevant during development.
        enabled: false,
      },
      {
        id: "label",
        // TODO: The Markdown Editor uses CodeMirror which does not fully comply to a11y yet,
        // this would hide the error.
        // selector:
        //  'input, select, textarea:not([style="position: absolute; bottom: -1em; padding: 0px; width: 1000px; height: 1em; outline: none;"])',
      },
    ],
  });
}
