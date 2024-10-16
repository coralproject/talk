import Joi from "joi";
import fetch from "node-fetch";

import { SearchPayload } from "coral-common/common/lib/types/tenor";
import { AppOptions } from "coral-server/app/";
import { WrappedInternalError } from "coral-server/errors";
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
      res.status(400).send(result.error ?? result.errors);
      return;
    }

    const params = result.value as BodyPayload;
    if (!params) {
      res.sendStatus(400);
      return;
    }

    const gifsEnabled = tenant.media?.gifs?.enabled ?? false;
    if (!gifsEnabled) {
      res.status(200).send({
        results: [],
      });
      return;
    }

    const apiKey = tenant.media?.gifs?.key ?? null;
    if (!apiKey || apiKey.length === 0) {
      res.status(200).send({
        results: [],
      });
      return;
    }

    const contentFilter = convertGiphyContentRatingToTenorLevel(
      tenant.media?.gifs?.maxRating
    );

    const url = new URL(TENOR_SEARCH_URL);
    url.searchParams.set("q", params.query);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("limit", `${SEARCH_LIMIT}`);
    url.searchParams.set("contentfilter", contentFilter);
    url.searchParams.set("media_filter", "gif,nanogif");

    if (params.pos) {
      url.searchParams.set("pos", params.pos);
    }

    try {
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
        return;
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
    } catch (e) {
      // Ensure that the API key doesn't get leaked to the logs by accident.
      if (e.message) {
        e.message = e.message.replace(tenant.media?.gifs?.key, "[Sensitive]");
      }
      throw new WrappedInternalError(e as Error, "tenor search error");
    }
  };
