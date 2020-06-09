import { Environment } from "relay-runtime";

import { createFetch, FetchVariables } from "coral-framework/lib/relay";

export const GIF_RESULTS_LIMIT = 8;

interface QueryTypes {
  variables: {
    query: string;
    page: number;
  };
}

export interface GifResultImage {
  height: string;
  url: string;
  width: string;
}

export type GifResultImageAnimated = GifResultImage & {
  mp4: string;
};

export interface GifResult {
  id: string;
  rating: string;
  url: string;
  title: string;
  images: {
    original_still: GifResultImage;
    original: GifResultImageAnimated;
    fixed_width_small: GifResultImageAnimated;
    fixed_width: GifResultImageAnimated;
    fixed_height_small: GifResultImageAnimated;
  };
}

export interface GifSearchPagination {
  count: number;
  offset: number;
  total_count: number;
}

interface GifSearchResp {
  ok: boolean;
  data: {
    data: GifResult[];
    pagination: GifSearchPagination;
  };
}

interface Resp {
  results: GifSearchResp;
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
    return rest.fetch<Resp>(url, {
      method: "GET",
    });
  }
);
