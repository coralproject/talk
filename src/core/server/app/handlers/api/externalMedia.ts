import Joi from "joi";

import validateImagePathname from "coral-common/helpers/validateImagePathname";
import { AppOptions } from "coral-server/app";
import { createManifestLoader } from "coral-server/app/helpers/manifestLoader";
import { validate } from "coral-server/app/request/body";
import { supportsMediaType } from "coral-server/models/tenant";
import { translate } from "coral-server/services/i18n";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const ExternalMediaQuerySchema = Joi.object().keys({
  url: Joi.string().uri().required(),
});

interface ExternalMediaQuery {
  url: string;
}

type Options = Pick<AppOptions, "i18n" | "config">;

export const externalMediaHandler = ({
  i18n,
  config,
}: Options): RequestHandler<TenantCoralRequest> => {
  const manifestLoader = createManifestLoader(
    config,
    "frame-asset-manifest.json"
  );
  const entrypointLoader = manifestLoader.createEntrypointLoader("frame");

  // TODO: add some kind of rate limiting or spam protection
  return async (req, res, next) => {
    const { tenant } = req.coral;

    const entrypoint = await entrypointLoader();
    if (!entrypoint) {
      next(new Error("Entrypoint not available"));
      return;
    }

    try {
      if (!supportsMediaType(tenant, "external")) {
        res.sendStatus(400);
        return;
      }

      const { url }: ExternalMediaQuery = validate(
        ExternalMediaQuerySchema,
        req.query
      );

      // Validate the media file pathname. We shouldn't encounter an error
      // related to an invalid url here because we validated it above with Joi.
      // If we do it'll be caught below anyways.
      const parsed = new URL(url);
      if (!validateImagePathname(parsed.pathname)) {
        res.sendStatus(400);
        return;
      }

      res.render("image", { url, entrypoint });
    } catch (err) {
      // There was no response! Return a translated error message.
      const bundle = i18n.getBundle(tenant.locale);
      const message = translate(
        bundle,
        "Requested media could not be found",
        "common-embedNotFound"
      );

      return res.status(400).render("oembed", { message, entrypoint });
    }
  };
};
