import Joi from "joi";

import {
  InternalError,
  NotFoundError,
  ValidationError,
} from "coral-server/errors";
import { validateSchema } from "coral-server/helpers";
import { createFetch } from "coral-server/services/fetch";

const OEmbedResponseSchema = Joi.object().keys({
  width: Joi.number().optional(),
  height: Joi.number().optional().allow(null),
  thumbnail_url: Joi.string().optional(),
  title: Joi.string().optional(),
  html: Joi.string().optional(),
});

export interface OEmbedResponse {
  width?: number;
  height?: number | null;
  title?: string;
  thumbnail_url?: string;
  html: string;
}

const fetch = createFetch({ name: "oEmbed-fetch" });

export async function fetchOEmbedResponse(
  type: "twitter" | "youtube",
  url: string,
  maxWidth?: number
) {
  let uri: string;

  switch (type) {
    case "youtube": {
      uri = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}`;

      if (maxWidth) {
        uri += `&maxWidth=${encodeURIComponent(maxWidth)}`;
      }

      break;
    }
    case "twitter": {
      uri = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;

      break;
    }
    default:
      throw new Error(`invalid oEmbed type: ${type}`);
  }

  const res = await fetch(uri);
  if (!res.ok) {
    if (res.status === 404) {
      throw new NotFoundError("GET", "TODO");
    }

    if (res.status === 400) {
      throw new ValidationError(new Error("Invalid embed uri"));
    }

    throw new InternalError("response from oEmbed was not ok", {
      type,
      uri,
      status: res.status,
    });
  }

  // Parse the json from the oEmbed response.
  const json = await res.json();

  // Validate and return the response.
  return validateSchema<OEmbedResponse>(OEmbedResponseSchema, json);
}
