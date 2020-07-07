import { searchGiphy } from "coral-server/services/giphy";
import { Request, RequestHandler } from "coral-server/types/express";

export const gifSearchHandler: RequestHandler = async (
  req: Request,
  res,
  next
) => {
  if (!req.coral) {
    return next(new Error("coral was not set"));
  }

  if (!req.query.query) {
    return next(new Error("search query required"));
  }

  if (!req.query.query) {
    return next(new Error("search query required"));
  }

  const coral = req.coral;
  const tenant = coral.tenant!;
  if (!tenant.embeds.giphyAPIKey) {
    return next(new Error("Must configure API key"));
  }

  try {
    const results = await searchGiphy(
      req.query.query,
      req.query.offset || "0",
      tenant.embeds.giphyMaxRating,
      tenant.embeds.giphyAPIKey,
      tenant.locale
    );
    res.json({ results });
  } catch (err) {
    next(err);
  }
};
