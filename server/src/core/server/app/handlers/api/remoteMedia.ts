import Joi from "joi";

import { validate } from "coral-server/app/request/body";
import { supportsMediaType } from "coral-server/models/tenant";
import { searchGiphy } from "coral-server/services/giphy";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const GIFSearchQuerySchema = Joi.object().keys({
  query: Joi.string().required(),
  offset: Joi.string().optional().default("0"),
});

interface GIFSearchQuery {
  query: string;
  offset: string;
}

export const gifSearchHandler: RequestHandler<TenantCoralRequest> = async (
  req,
  res,
  next
) => {
  const { tenant } = req.coral;

  try {
    const { query, offset }: GIFSearchQuery = validate(
      GIFSearchQuerySchema,
      req.query
    );

    if (!supportsMediaType(tenant, "giphy")) {
      res.sendStatus(400);
      return;
    }

    const results = await searchGiphy(query, offset, tenant);

    res.json(results);
  } catch (err) {
    next(err);
  }
};
