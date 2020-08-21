import Joi from "@hapi/joi";
import { AppOptions } from "coral-server/app";

import { validate } from "coral-server/app/request/body";
import { supportsMediaType } from "coral-server/models/tenant";
import { translate } from "coral-server/services/i18n";
import { fetchOEmbedResponse } from "coral-server/services/oembed";
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

export type OembedHandler = Pick<AppOptions, "i18n">;

export const oembedHandler = ({
  i18n,
}: OembedHandler): RequestHandler<TenantCoralRequest> => {
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
      const response = await fetchOEmbedResponse(type, url, maxWidth);
      if (!response?.html) {
        // There was no response! Return a translated error message.
        const bundle = i18n.getBundle(tenant.locale);
        const message = translate(
          bundle,
          "Requested media could not be found",
          "common-embedNotFound"
        );

        return res.status(404).render("oembed", { message });
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
