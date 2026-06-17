import Joi from "joi";

import { FetchPayload } from "coral-common/common/lib/types/tenor";
import { InternalError } from "coral-server/errors";
import { validateSchema } from "coral-server/helpers";
import { supportsMediaType, Tenant } from "coral-server/models/tenant";
import { createFetch } from "coral-server/services/fetch";

const KLIPY_FETCH_URL = "https://api.klipy.com/v2/posts";
const fetch = createFetch({ name: "klipy" });

const KlipyResponseMediaObjectSchema = Joi.object().keys({
  preview: { url: Joi.string().required(), dims: Joi.array().required() },
  mp4: { url: Joi.string().required() },
});

const KlipyResponseObjectsSchema = Joi.array().items({
  id: Joi.string().required(),
  title: Joi.string().allow(""),
  media_formats: KlipyResponseMediaObjectSchema,
});

const KlipyRetrieveResponseSchema = Joi.object().keys({
  results: KlipyResponseObjectsSchema,
});

export async function retrieveFromKlipy(
  tenant: Tenant,
  id: string
): Promise<FetchPayload> {
  if (!supportsMediaType(tenant, "klipy") || !tenant.media?.gifs?.key) {
    throw new InternalError("Klipy was not enabled");
  }

  const url = new URL(`${KLIPY_FETCH_URL}`);
  url.searchParams.set("key", tenant.media.gifs.key);
  url.searchParams.set("ids", id);
  //   url.searchParams.set("media_filter", "preview,mp4");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new InternalError("response from Klipy was not ok", {
        status: res.status,
      });
    }

    const data = await res.json();
    return validateSchema(KlipyRetrieveResponseSchema, data);
  } catch (err) {
    // Ensure that the API key doesn't get leaked to the logs by accident.
    if (err.message) {
      err.message = err.message.replace(tenant.media.gifs.key, "[Sensitive]");
    }

    // Rethrow the error.
    throw err;
  }
}
