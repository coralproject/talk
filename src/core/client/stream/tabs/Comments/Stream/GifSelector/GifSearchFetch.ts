import { Environment } from "relay-runtime";
import {
  createFetch,
  FetchVariables,
} from "coral-framework/lib/relay";

type QueryTypes = {
  variables: {
    query: string;
  };
};

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
  };
}

interface GifSearchResp {
  ok: boolean;
  data: {
    data: GifResult[];
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
    const url = `/remote-media/gifs?${params.toString()}`;
    return rest.fetch<Resp>(url, {
      method: "GET",
    });
  }
);
