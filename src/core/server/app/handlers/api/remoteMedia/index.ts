import { searchGiphy } from "coral-server/services/giphy";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export const gifSearchHandler: RequestHandler<TenantCoralRequest> = async (
  req,
  res,
  next
) => {
  const { tenant } = req.coral;

  if (!req.query.query) {
    return next(new Error("search query required"));
  }

  try {
    const results = await searchGiphy(
      req.query.query,
      req.query.offset || "0",
      tenant
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
};
