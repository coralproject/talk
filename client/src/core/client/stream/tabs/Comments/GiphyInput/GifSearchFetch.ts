import { Environment } from "relay-runtime";

import { GiphyGifSearchResponse } from "coral-common/types/giphy";
import { createFetch, FetchVariables } from "coral-framework/lib/relay";

export const GIF_RESULTS_LIMIT = 10;

interface QueryTypes {
  variables: {
    query: string;
    page: number;
  };
}

export const GifSearchFetch = createFetch(
  "gifSearch",
  async (
    environment: Environment,
    variables: FetchVariables<QueryTypes>,
    { rest }
  ) => {
    const params = new URLSearchParams();
    params.set("query", variables.query);
    params.set("offset", `${variables.page * GIF_RESULTS_LIMIT}`);
    const url = `/remote-media/gifs?${params.toString()}`;
    return rest.fetch<GiphyGifSearchResponse>(url, {
      method: "GET",
    });
  }
);
