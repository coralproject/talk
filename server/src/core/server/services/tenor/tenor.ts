import Joi from "joi";

import { FetchPayload } from "coral-common/common/lib/types/tenor";
import { InternalError } from "coral-server/errors";
import { validateSchema } from "coral-server/helpers";
import { supportsMediaType, Tenant } from "coral-server/models/tenant";
import { createFetch } from "coral-server/services/fetch";

const TENOR_FETCH_URL = "https://tenor.googleapis.com/v2/posts";
const fetch = createFetch({ name: "tenor" });

const TenorResponseMediaObjectSchema = Joi.object().keys({
  gifpreview: { url: Joi.string().required(), dims: Joi.array().required() },
  mp4: { url: Joi.string().required() },
});

const TenorResponseObjectsSchema = Joi.array().items({
  id: Joi.string().required(),
  title: Joi.string().allow(""),
  media_formats: TenorResponseMediaObjectSchema,
});

const TenorRetrieveResponseSchema = Joi.object().keys({
  results: TenorResponseObjectsSchema,
});

export async function retrieveFromTenor(
  tenant: Tenant,
  id: string
): Promise<FetchPayload> {
  if (!supportsMediaType(tenant, "tenor") || !tenant.media?.gifs?.key) {
    throw new InternalError("Tenor was not enabled");
  }

  const url = new URL(`${TENOR_FETCH_URL}`);
  url.searchParams.set("key", tenant.media.gifs.key);
  url.searchParams.set("ids", id);
  url.searchParams.set("media_filter", "gifpreview,mp4");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new InternalError("response from Tenor was not ok", {
        status: res.status,
      });
    }

    const data = await res.json();
    return validateSchema(TenorRetrieveResponseSchema, data);
  } catch (err) {
    // Ensure that the API key doesn't get leaked to the logs by accident.
    if (err.message) {
      err.message = err.message.replace(tenant.media.gifs.key, "[Sensitive]");
    }

    // Rethrow the error.
    throw err;
  }
}
