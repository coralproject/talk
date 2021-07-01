import { AppOptions } from "coral-server/app";
import Joi from "joi";

import { validate } from "coral-server/app/request/body";
import { NotFoundError, ValidationError } from "coral-server/errors";
import { supportsMediaType } from "coral-server/models/tenant";
import { translate } from "coral-server/services/i18n";
import {
  fetchOEmbedResponse,
  OEmbedResponse,
} from "coral-server/services/oembed";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const OEmbedQuerySchema = Joi.object().keys({
  url: Joi.string().uri().required(),
  type: Joi.string().allow("twitter", "youtube").only(),
  maxWidth: Joi.number().optional(),
});

interface OEmbedQuery {
  type: "twitter" | "youtube";
  url: string;
  maxWidth?: number;
}

type Options = Pick<AppOptions, "i18n">;

export const oembedHandler = ({
  i18n,
}: Options): RequestHandler<TenantCoralRequest> => {
  // TODO: add some kind of rate limiting or spam protection
  return async (req, res, next) => {
    const { tenant } = req.coral;

    try {
      const { type, url, maxWidth }: OEmbedQuery = validate(
        OEmbedQuerySchema,
        req.query
      );

      if (!supportsMediaType(tenant, type)) {
        res.sendStatus(400);
        return;
      }

      // Get the oEmbed response.

      // TODO: look at caching this response
      let response: OEmbedResponse | null = null;
      try {
        response = await fetchOEmbedResponse(type, url, maxWidth);
      } catch (e) {
        const bundle = i18n.getBundle(tenant.locale);
        let message: string;
        let status: number;
        if (e instanceof ValidationError) {
          status = 400;
          message = translate(
            bundle,
            "TODO: Invalid external media URL",
            "common-embedInvalid" // TODO: register this
          );
        } else if (e instanceof NotFoundError) {
          status = 404;
          message = translate(
            bundle,
            "Requested media could not be found",
            "common-embedNotFound"
          );
        } else {
          status = 500;
          message = translate(
            bundle,
            "TODO: We encountered an internal error fetching this media",
            "common-embedInternalError"
          );
        }

        return res.status(status).render("oembed", { message });
      }

      // Pull out some params from the response.
      const { width, height, html } = response;

      // If there's a width and height (and they aren't zero), then compute the
      // ratio that we'll pass down to the template.
      let ratio: number | undefined;
      if (width && height) {
        ratio = Math.floor((height / width) * 100);
      }

      // Send back the template!
      return res.render("oembed", { html, ratio });
    } catch (err) {
      next(err);
    }
  };
};
