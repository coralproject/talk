import Joi from "@hapi/joi";
import { AppOptions } from "coral-server/app";

import { validate } from "coral-server/app/request/body";
import { supportsMediaType } from "coral-server/models/tenant";
import { translate } from "coral-server/services/i18n";
import { fetchOEmbedResponse } from "coral-server/services/oembed";
import { RequestHandler } from "coral-server/types/express";

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

export const oembedHandler = ({ i18n }: OembedHandler): RequestHandler => {
  // TODO: add some kind of rate limiting or spam protection
  return async (req, res, next) => {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const { type, url, maxWidth }: OEmbedQuery = validate(
        OEmbedQuerySchema,
        req.query
      );

      if (!supportsMediaType(tenant, type)) {
        res.sendStatus(400);
        return;
      }

      let style = `
          body {
            margin: 0;
            font-family: sans-serif;
          }
          .container * {
            margin: 0!important;
          }
      `;
      const response = await fetchOEmbedResponse(type, url, maxWidth);
      if (response === null || !response.html) {
        const bundle = i18n.getBundle(tenant.locale);
        const message = translate(
          bundle,
          "Requested media could not be found",
          "common-embedNotFound"
        );
        res.status(404);
        res.send(
          `<html>
            <style>
              ${style}
            </style>
            <body>
            ${message}
            </body>
          <html>`
        );
        return;
      }

      const { width, height, html } = response;

      // Compile the style to be used for the embed.
      if (width && height) {
        style += `
          .container {
            overflow: hidden;
            position: relative;
            padding-bottom: ${(height / width) * 100}%;
          }
          .container iframe {
            border: 0;
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
          }
        `;
      }

      // Send back the HTML for the oEmbed.
      res.send(
        `<html>
          <style>
            ${style}
          </style>
            <body>
              <div class="container">
                ${html}
              </div>
            </body>
          <html>`
      );
    } catch (err) {
      next(err);
    }
  };
};
