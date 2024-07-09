import Joi from "joi";
import fetch from "node-fetch";

import { AppOptions } from "coral-server/app/";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const SEARCH_LIMIT = 32;

const schema = Joi.object({
  query: Joi.string().required().not().empty(),
});

interface BodyPayload {
  query: string;
}

interface MediaFormat {
  url: string;
  duration: number;
  dims: number[];
  size: number;
}

interface SearchResult {
  id: string;
  title: string;
  created: number;
  content_description: string;
  itemurl: string;
  url: string;
  tags: string[];
  flags: [];
  hasaudio: boolean;
  media_formats: {
    webm: MediaFormat;
    mp4: MediaFormat;
    nanowebm: MediaFormat;
    loopedmp4: MediaFormat;
    gifpreview: MediaFormat;
    tinygifpreview: MediaFormat;
    nanomp4: MediaFormat;
    nanogifpreview: MediaFormat;
    tinymp4: MediaFormat;
    gif: MediaFormat;
    webp: MediaFormat;
    mediumgif: MediaFormat;
    tinygif: MediaFormat;
    nanogif: MediaFormat;
    tinywebm: MediaFormat;
  };
}

interface SearchPayload {
  results: SearchResult[];
}

export const convertGiphyContentRatingToTenorLevel = (
  rating: string | null | undefined
) => {
  if (!rating) {
    return 1;
  }

  const lowerRating = rating.toLowerCase();
  if (lowerRating === "g") {
    return 1;
  }
  if (lowerRating === "pg") {
    return 2;
  }
  if (lowerRating === "pg-13") {
    return 3;
  }
  if (lowerRating === "r") {
    return 4;
  }

  return 1;
};

export const tenorSearchHandler =
  ({ mongo }: AppOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    const { tenant } = req.coral;
    if (!tenant) {
      res.status(403).send("tenant not found");
      return;
    }

    const { user } = req;
    if (!user) {
      res.status(403).send("user is required");
      return;
    }

    const result = schema.validate(req.query);
    if (result.error || result.errors) {
      res.status(400).send(result.errors);
      return;
    }

    const params = result.value as BodyPayload;
    if (!params) {
      res.sendStatus(400);
      return;
    }

    const gifsEnabled = tenant.media?.gifs.enabled ?? false;
    if (!gifsEnabled) {
      res.status(200).send([]);
      return;
    }

    const apiKey = tenant.media?.gifs.key ?? null;
    if (!apiKey || apiKey.length === 0) {
      res.status(200).send([]);
      return;
    }

    const contentFilter = convertGiphyContentRatingToTenorLevel(
      tenant.media?.gifs.maxRating
    );

    const url = new URL("https://tenor.googleapis.com/v2/search");
    url.searchParams.set("q", params.query);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("limit", `${SEARCH_LIMIT}`);
    url.searchParams.set("ContentFilter", `${contentFilter}`);

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      res.status(500).send([]);
      return;
    }

    const json = (await response.json()) as SearchPayload;
    if (!json) {
      res.status(500).send([]);
    }

    res.status(200).send(
      json.results.map((r) => {
        return {
          id: r.id,
          title: r.title,
          url: r.media_formats.gif.url,
          preview: r.media_formats.tinygif.url,
        };
      })
    );
  };
