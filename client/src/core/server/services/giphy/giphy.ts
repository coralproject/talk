import Joi from "joi";
import { URL } from "url";

import { GIPHY_FETCH, GIPHY_SEARCH } from "coral-common/constants";
import { LanguageCode } from "coral-common/helpers";
import {
  GiphyGifRetrieveResponse,
  GiphyGifSearchResponse,
} from "coral-common/types/giphy";
import { InternalError } from "coral-server/errors";
import { validateSchema } from "coral-server/helpers";
import { supportsMediaType, Tenant } from "coral-server/models/tenant";
import { createFetch } from "coral-server/services/fetch";

const RATINGS_ORDER = ["g", "pg", "pg13", "r"];
const fetch = createFetch({ name: "giphy" });

type GiphyLanguage = "en" | "es" | "fr" | "de" | "pt";

const GiphyGifImageSchema = Joi.object().keys({
  url: Joi.string().required(),
  width: Joi.string().required(),
  height: Joi.string().required(),
});

const GiphyGifOriginalImageSchema = Joi.object().keys({
  url: Joi.string().required(),
  width: Joi.string().required(),
  height: Joi.string().required(),
  mp4: Joi.string().required(),
});

const GiphyGifImagesSchema = Joi.object().keys({
  original: GiphyGifOriginalImageSchema.required(),
  fixed_height_downsampled: GiphyGifImageSchema.required(),
  original_still: GiphyGifImageSchema.required(),
});

const GiphyGifSchema = Joi.object().keys({
  id: Joi.string().required(),
  url: Joi.string().required(),
  title: Joi.string().optional().allow(""),
  rating: Joi.string().required(),
  images: GiphyGifImagesSchema,
});

const GiphySearchResponseSchema = Joi.object().keys({
  data: Joi.array().items(GiphyGifSchema),
  pagination: Joi.object().keys({
    offset: Joi.number().required(),
    total_count: Joi.number().required(),
    count: Joi.number().required(),
  }),
});

const GiphyRetrieveResponseSchema = Joi.object().keys({
  data: GiphyGifSchema.required(),
});

export function ratingIsAllowed(rating: string, tenant: Tenant) {
  const compareRating = rating.toLowerCase();
  const maxRating = tenant.media?.giphy.maxRating || "g";

  const compareIndex = RATINGS_ORDER.indexOf(compareRating);
  const maxIndex = RATINGS_ORDER.indexOf(maxRating);

  if (compareIndex >= 0 && maxIndex >= 0) {
    return compareIndex <= maxIndex;
  }

  return false;
}

/**
 * convertLanguage returns the language code for the related Perspective API
 * model in the ISO 631-1 format.
 *
 * @param locale the language on the tenant in the BCP 47 format.
 */
function convertLanguage(locale: LanguageCode): GiphyLanguage {
  switch (locale) {
    case "en-US":
      return "en";
    case "es":
      return "es";
    case "fr-FR":
      return "fr";
    case "de":
      return "de";
    case "pt-BR":
      return "pt";
    default:
      return "en";
  }
}

export async function searchGiphy(
  query: string,
  offset: string,
  tenant: Tenant
): Promise<GiphyGifSearchResponse> {
  if (!supportsMediaType(tenant, "giphy") || !tenant.media.giphy.key) {
    throw new InternalError("Giphy was not enabled");
  }

  const language = convertLanguage(tenant.locale);
  const url = new URL(GIPHY_SEARCH);
  url.searchParams.set("api_key", tenant.media.giphy.key);
  url.searchParams.set("limit", "10");
  url.searchParams.set("lang", language);
  url.searchParams.set("offset", offset);
  url.searchParams.set("rating", tenant.media.giphy.maxRating!);
  url.searchParams.set("q", query);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new InternalError("response from Giphy was not ok", {
        status: res.status,
      });
    }

    // Parse the JSON body and send back the result!
    const data = await res.json();
    return validateSchema(GiphySearchResponseSchema, data);
  } catch (err) {
    // Ensure that the API key doesn't get leaked to the logs by accident.
    if (err.message) {
      err.message = err.message.replace(tenant.media.giphy.key, "[Sensitive]");
    }

    // Rethrow the error.
    throw err;
  }
}

export async function retrieveFromGiphy(
  tenant: Tenant,
  id: string
): Promise<GiphyGifRetrieveResponse> {
  if (!supportsMediaType(tenant, "giphy") || !tenant.media.giphy.key) {
    throw new InternalError("Giphy was not enabled");
  }

  const url = new URL(`${GIPHY_FETCH}/${id}`);
  url.searchParams.set("api_key", tenant.media.giphy.key);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new InternalError("response from Giphy was not ok", {
        status: res.status,
      });
    }

    // Parse the JSON body and send back the result!
    const data = await res.json();
    return validateSchema(GiphyRetrieveResponseSchema, data);
  } catch (err) {
    // Ensure that the API key doesn't get leaked to the logs by accident.
    if (err.message) {
      err.message = err.message.replace(tenant.media.giphy.key, "[Sensitive]");
    }

    // Rethrow the error.
    throw err;
  }
}
