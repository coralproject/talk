import bodyParser from "body-parser";
import { Router } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import nunjucks from "nunjucks";

import { AppOptions } from "coral-server/app";
import { RequestLimiter } from "coral-server/app/request/limiter";
import {
  AsyncRequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

const renderIndex = (messages?: string[], token?: string, payload?: string) => {
  return nunjucks.render("tokenTest/index.html", {
    messages,
    token,
    payload,
  });
};

export const indexHandler = ({
  redis,
  config,
}: AppOptions): AsyncRequestHandler<TenantCoralRequest> => {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "1m",
    max: 100,
    prefix: "ip",
    config,
  });

  return async (req, res, next) => {
    await ipLimiter.test(req, req.ip);

    const html = nunjucks.render("tokenTest/index.html", {});
    res.status(200).send(html);
  };
};

const submitSchema = Joi.object({
  token: Joi.string().required(),
});

interface SubmitBody {
  token: string;
}

export const submitHandler = ({
  redis,
  config,
}: AppOptions): AsyncRequestHandler<TenantCoralRequest> => {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "1m",
    max: 100,
    prefix: "ip",
    config,
  });

  return async (req, res, next) => {
    await ipLimiter.test(req, req.ip);

    const result = submitSchema.validate(req.body);
    if (result.error) {
      res.send(renderIndex([result.error.message]));
      return;
    }

    const body = result.value as SubmitBody;
    if (!body) {
      res.send(renderIndex());
      return;
    }

    const cleanToken = body.token.trim();
    const decodedToken = jwt.decode(cleanToken);
    if (!decodedToken) {
      res.send(renderIndex(["Token is invalid."]));
      return;
    }

    res.send(
      renderIndex([], cleanToken, JSON.stringify(decodedToken, null, 2).trim())
    );
  };
};

export const createTokenTestRouter = (options: AppOptions) => {
  const router = Router();

  router.get("/", indexHandler(options));
  router.post("/", bodyParser.urlencoded(), submitHandler(options));

  return router;
};
