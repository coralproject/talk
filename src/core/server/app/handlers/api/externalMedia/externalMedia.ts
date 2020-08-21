import Joi from "@hapi/joi";

import { VALID_MEDIA_FILE_URL } from "coral-common/constants";
import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { supportsMediaType } from "coral-server/models/tenant";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const ExternalMediaQuerySchema = Joi.object().keys({
  url: Joi.string().uri().required(),
});

interface OEmbedQuery {
  url: string;
}

export type ExternalMediaHandler = Pick<AppOptions, "i18n">;

export const externalMediaHandler = ({
  i18n,
}: ExternalMediaHandler): RequestHandler<TenantCoralRequest> => {
  // TODO: add some kind of rate limiting or spam protection
  return async (req, res, next) => {
    const { tenant } = req.coral;

    try {
      const { url }: OEmbedQuery = validate(
        ExternalMediaQuerySchema,
        req.query
      );

      if (!supportsMediaType(tenant, "external")) {
        res.sendStatus(400);
        return;
      }

      if (!VALID_MEDIA_FILE_URL.test(url)) {
        res.sendStatus(400);
        return;
      }

      const style = `
        body {
          margin: 0;
          font-family: sans-serif;
        }
        .container * {
          margin: 0!important;
        }
        .image {
          display: block;
          max-width: 100%;
        }
      `;

      res.send(
        `<html>
          <style>
            ${style}
          </style>
            <body>
                <img src="${url}" class="image" />
            </body>
          <html>`
      );
    } catch (err) {
      next(err);
    }
  };
};
