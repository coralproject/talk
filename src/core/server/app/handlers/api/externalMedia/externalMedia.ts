import Joi from "@hapi/joi";

import validateImagePathname from "coral-common/helpers/validateImagePathname";
import { validate } from "coral-server/app/request/body";
import { supportsMediaType } from "coral-server/models/tenant";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const ExternalMediaQuerySchema = Joi.object().keys({
  url: Joi.string().uri().required(),
});

interface ExternalMediaQuery {
  url: string;
}

export const externalMediaHandler = (): RequestHandler<TenantCoralRequest> => {
  // TODO: add some kind of rate limiting or spam protection
  return async (req, res, next) => {
    const { tenant } = req.coral;

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

      res.render("image", { url });
    } catch (err) {
      next(err);
    }
  };
};
