import { createFetch } from "coral-server/services/fetch";
import { RequestHandler } from "coral-server/types/express";

const fetchURL = (url: string, type: string) => {
  if (type === "twitter") {
    return `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
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

export const oembedHandler = (): RequestHandler => {
  // TODO: add some kind of rate limiting or spam protection
  // on this endpoint

  const fetch = createFetch({ name: "twitter-fetch" });

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

      if (type === "youtube" && !tenant.embeds.youtube) {
        res.sendStatus(400);
        return;
      }
      if (type === "twitter" && !tenant.embeds.twitter) {
        res.sendStatus(400);
        return;
      }

      const response = await fetch(fetchURL(url, type));

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
      res.status(200);
      res.send(
        `<html>
            <body>
              ${json.html}
            </body>
          <html>`
      );
    } catch (err) {
      next(err);
    }
  };
};
