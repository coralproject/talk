import { createFetch } from "coral-server/services/fetch";
import { Request, RequestHandler } from "coral-server/types/express";

const fetchURL = (
  url: string,
  type: "twitter" | "youtube",
  query: Request["query"]
) => {
  if (type === "twitter") {
    const suffix = query.maxWidth ? `&maxWidth=${query.maxWidth}` : "";
    return `https://publish.twitter.com/oembed?url=${encodeURIComponent(
      url
    )}${suffix}`;
  }
  if (type === "youtube") {
    return `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}`;
  }

  return "";
};

const createNotFoundMessage = (type: string) => {
  if (type === "twitter") {
    return "Tweet could not be found. Perhaps it was deleted?";
  }
  if (type === "youtube") {
    return "YouTube video could not be found. Perhaps it was deleted?";
  }

  return null;
};

const fetch = createFetch({ name: "oembed-fetch" });

export const oembedHandler = (): RequestHandler => {
  // TODO: add some kind of rate limiting or spam protection
  // on this endpoint
  return async (req, res, next) => {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const url = req.query.url;
      const type = req.query.type;

      if (!url || !type) {
        res.sendStatus(400);
        return;
      }

      if (type !== "youtube" && type !== "twitter") {
        res.sendStatus(400);
        return;
      }

      if (
        type === "youtube" &&
        (!tenant.media ||
          !tenant.media.youtube ||
          !tenant.media.youtube.enabled)
      ) {
        res.sendStatus(400);
        return;
      }

      if (
        type === "twitter" &&
        (!tenant.media ||
          !tenant.media.twitter ||
          !tenant.media.twitter.enabled)
      ) {
        res.sendStatus(400);
        return;
      }
      const response = await fetch(fetchURL(url, type, req.query));

      if (!response.ok && response.status === 404) {
        res.status(404);
        res.send(
          `<html>
            <body>
              ${createNotFoundMessage(type)}
            </body>
          <html>`
        );
        return;
      } else if (!response.ok) {
        next(new Error("unable to retrieve embed"));
        return;
      }

      const json = await response.json();
      let style = `
          body {
            margin: 0;
          }
          .container * {
            margin: 0!important;
          }
      `;
      if (json.width && json.height) {
        style += `
          .container {
            overflow: hidden;
            position: relative;
            padding-bottom: ${
              (parseInt(json.height, 10) / parseInt(json.width, 10)) * 100
            }%;
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

      res.status(200);
      res.send(
        `<html>
          <style>
          ${style}
          </style>
            <body>
              <div class="container">
              ${json.html}
              </div>
            </body>
          <html>`
      );
    } catch (err) {
      next(err);
    }
  };
};
