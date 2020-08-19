// import Joi from "@hapi/joi";
import { AppOptions } from "coral-server/app";

// import { validate } from "coral-server/app/request/body";
// import { supportsMediaType } from "coral-server/models/tenant";
// import { translate } from "coral-server/services/i18n";
// import { fetchOEmbedResponse } from "coral-server/services/oembed";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

// const OEmbedQuerySchema = Joi.object().keys({
//   url: Joi.string().uri().required(),
//   type: Joi.string().allow("twitter", "youtube").only(),
//   maxWidth: Joi.number().optional(),
// });

// interface OEmbedQuery {
//   type: "twitter" | "youtube";
//   url: string;
//   maxWidth?: number;
// }

export type IframeHandler = Pick<AppOptions, "i18n">;

export const iframeHandler = ({
  i18n,
}: IframeHandler): RequestHandler<TenantCoralRequest> => {
  // TODO: add some kind of rate limiting or spam protection
  return async (req, res, next) => {
    // const { tenant } = req.coral;

    try {
      // const { type, url, maxWidth }: OEmbedQuery = validate(
      //   OEmbedQuerySchema,
      //   req.query
      // );

      // if (!supportsMediaType(tenant, type)) {
      //   res.sendStatus(400);
      //   return;
      // }

      const style = `
          body {
            margin: 0;
            font-family: sans-serif;
          }
          .container * {
            margin: 0!important;
          }
      `;
      // Send back the HTML for the oEmbed.
      res.send(
        `<html>
          <style>
            ${style}
          </style>
            <body>
              <div class="container">
                <img src="${req.query.src}" />
              </div>
            </body>
          <html>`
      );
    } catch (err) {
      next(err);
    }
  };
};
