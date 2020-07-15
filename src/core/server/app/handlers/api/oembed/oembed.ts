import Joi from "@hapi/joi";

import { validate } from "coral-server/app/request/body";
import { supportsMediaType } from "coral-server/models/tenant";
import { fetchOEmbedResponse } from "coral-server/services/oembed";
import { RequestHandler } from "coral-server/types/express";

const createNotFoundMessage = (type: "twitter" | "youtube") => {
  switch (type) {
    case "twitter":
      return "Tweet could not be found. Perhaps it was deleted?";
    case "youtube":
      return "YouTube video could not be found. Perhaps it was deleted?";
    default:
      throw new Error(`invalid type provided: ${type}`);
  }
};

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

export const oembedHandler = (): RequestHandler => {
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

      // Get the oEmbed response.
      const response = await fetchOEmbedResponse(type, url, maxWidth);
      if (response === null || !response.html) {
        res.status(404);
        res.send(
          `<html>
            <body>
              ${createNotFoundMessage(type)}
            </body>
          <html>`
        );
        return;
      }

      const { width, height, html } = response;

      // Compile the style to be used for the embed.
      let style = `
          body {
            margin: 0;
          }
          .container * {
            margin: 0!important;
          }
      `;
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
