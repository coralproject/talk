import { FetchFunction } from "relay-runtime";

import { NetworkError } from "../errors";

/**
 * fetchQuery is a simple implementation of the `FetchFunction`
 * required by Relay. It'll return a `NetworkError` on failure.
 */
const fetchQuery: FetchFunction = (operation, variables) => {
  return fetch("/api/tenant/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      throw new NetworkError(err);
    });
};

export default fetchQuery;
