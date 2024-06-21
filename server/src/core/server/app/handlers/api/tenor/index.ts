import Joi from "joi";
import fetch from "node-fetch";

import { AppOptions } from "coral-server/app/";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const SEARCH_LIMIT = 16;

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

export const tenorSearchHandler =
  ({ mongo }: AppOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    const { tenant } = req.coral;
    if (!tenant) {
      // throw new TenantNotFoundError(req.hostname);
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

    const apiKey = tenant.media?.gifs.enabled ? tenant.media.gifs.key : null;
    if (!apiKey || apiKey.length === 0) {
      res.status(200).send([]);
      return;
    }

    const url = new URL("https://tenor.googleapis.com/v2/search");
    url.searchParams.set("q", params.query);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("limit", `${SEARCH_LIMIT}`);

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
          url: r.media_formats.gif.url,
          preview: r.media_formats.tinygif.url,
        };
      })
    );
  };
