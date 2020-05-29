import { createFetch } from "coral-server/services/fetch";
import { RequestHandler } from "coral-server/types/express";

const fetchURL = (url: string, type: string) => {
  if (type === "twitter") {
    return `https://publish.twitter.com/oembed?url=${url}`;
  }
  if (type === "youtube") {
    return `https://www.youtube.com/oembed?url=${url}`;
  }

  return "";
};

export const oEmbedHandler = (): RequestHandler => {
  // TODO: add some kind of rate limiting or spam protection
  // on this endpoint

  const fetch = createFetch({ name: "twitter-fetch" });

  return async (req, res, next) => {
    try {
      const url = encodeURIComponent(req.query.url);
      const type = req.query.type;

      if (type !== "youtube" && type !== "twitter") {
        res.sendStatus(400);
        return;
      }

      const response = await fetch(fetchURL(url, type));

      if (!response.ok) {
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
