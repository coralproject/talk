import Joi from "joi";
import fetch from "node-fetch";

import { AppOptions } from "coral-server/app/";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const SEARCH_LIMIT = 32;
const TENOR_SEARCH_URL = "https://tenor.googleapis.com/v2/search";

const schema = Joi.object({
  query: Joi.string().required().not().empty(),
  pos: Joi.string().optional(),
});

interface BodyPayload {
  query: string;
  pos?: string;
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
  next: string;
}

export const convertGiphyContentRatingToTenorLevel = (
  rating: string | null | undefined
): string => {
  if (!rating) {
    return "high";
  }

  const lowerRating = rating.toLowerCase();
  if (lowerRating === "g") {
    return "high";
  }
  if (lowerRating === "pg") {
    return "medium";
  }
  if (lowerRating === "pg-13") {
    return "low";
  }
  if (lowerRating === "r") {
    return "off";
  }

  return "high";
};

export const tenorSearchHandler =
  ({ mongo }: AppOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    const { tenant } = req.coral;
    if (!tenant) {
      res.status(404).send("tenant not found");
      return;
    }

    if (!req.user) {
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
      res.status(200).send({
        results: [],
      });
      return;
    }

    const apiKey = tenant.media?.gifs.key ?? null;
    if (!apiKey || apiKey.length === 0) {
      res.status(200).send({
        results: [],
      });
      return;
    }

    const contentFilter = convertGiphyContentRatingToTenorLevel(
      tenant.media?.gifs.maxRating
    );

    const url = new URL(TENOR_SEARCH_URL);
    url.searchParams.set("q", params.query);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("limit", `${SEARCH_LIMIT}`);
    url.searchParams.set("contentfilter", contentFilter);

    if (params.pos) {
      url.searchParams.set("pos", params.pos);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      res.status(500).send({
        results: [],
      });
      return;
    }

    const json = (await response.json()) as SearchPayload;
    if (!json) {
      res.status(500).send({
        results: [],
      });
    }

    res.status(200).send({
      results: json.results.map((r) => {
        return {
          id: r.id,
          title: r.title,
          url: r.media_formats.gif.url,
          preview: r.media_formats.nanogif.url,
        };
      }),
      next: json.next,
    });
  };
