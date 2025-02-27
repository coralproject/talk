import bodyParser from "body-parser";
import { Router } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import nunjucks from "nunjucks";

import { AppOptions } from "coral-server/app";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";
import {
  AsyncRequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

// eslint-disable-next-line no-shadow
enum AnalysisMessageType {
  Unknown = "Unknown",
  Message = "Message",
  Warning = "Warning",
  Error = "Error",
  Positive = "Positive",
}

const renderIndex = (
  messages?: string[],
  token?: string,
  payload?: string,
  analysis: PayloadComment[] = []
) => {
  return nunjucks.render("tokenTest/index.html", {
    messages,
    token,
    payload,
    analysis,
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

interface PayloadComment {
  type: AnalysisMessageType;
  message: string;
}

interface PossibleSSOPayloadStructure {
  user?: {
    id?: string;
    username?: string;
    email?: string;
    role?: string;
  };
}

const analyseId = (id: string | undefined): PayloadComment[] => {
  if (!id) {
    return [
      {
        type: AnalysisMessageType.Error,
        message: "`user.id` is missing. This is required.",
      },
    ];
  }

  const messages: PayloadComment[] = [];

  // see if it looks like a UUID
  const uuidRegex = new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  );
  const uuidResult = uuidRegex.test(id);
  if (uuidResult) {
    messages.push({
      type: AnalysisMessageType.Positive,
      message: "`user.id` appears to be a uuid.",
    });
  }

  const hashRegex = new RegExp(/^[0-9a-zA-Z]{16-256}$/);
  const hashResult = hashRegex.test(id);
  if (hashResult) {
    messages.push({
      type: AnalysisMessageType.Positive,
      message: "`user.id` appears to be a hash value.",
    });
  }

  const integerRegex = new RegExp(/^[0-9]{16-256}$/);
  const integerResult = integerRegex.test(id);
  if (integerResult) {
    messages.push({
      type: AnalysisMessageType.Positive,
      message: "`user.id` appears to be an integer value.",
    });
  }

  if (!uuidResult && !hashResult && !integerRegex) {
    messages.push({
      type: AnalysisMessageType.Warning,
      message:
        "Unable to determine if `user.id` is a valid identifier. This could be fine, but we recommend using a unique uuid, hash, or integer value.",
    });
  }

  return messages;
};

const analyseEmail = (email: string | undefined): PayloadComment[] => {
  if (!email) {
    return [
      {
        type: AnalysisMessageType.Error,
        message: "`user.email` is missing. This is required.",
      },
    ];
  }

  const messages: PayloadComment[] = [];

  const regex = new RegExp(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/);
  const result = regex.test(email);
  if (result) {
    messages.push({
      type: AnalysisMessageType.Positive,
      message: "`user.email` appears to be valid.",
    });
  } else {
    messages.push({
      type: AnalysisMessageType.Warning,
      message: "Unable to determine if `user.email` is a valid email.",
    });
  }

  return messages;
};

const analyseUsername = (username: string | undefined): PayloadComment[] => {
  if (!username) {
    return [
      {
        type: AnalysisMessageType.Warning,
        message:
          "`user.username` is undefined. This is not required, but highly recommended.",
      },
    ];
  }

  return [
    {
      type: AnalysisMessageType.Positive,
      message: "`user.username` appears to be valid.",
    },
  ];
};

const analyseRole = (role: string | undefined): PayloadComment[] => {
  if (!role) {
    return [
      {
        type: AnalysisMessageType.Warning,
        message: `\`user.role\` is undefined. It will default to "${GQLUSER_ROLE.COMMENTER}."`,
      },
    ];
  }

  const roleEntries = Object.entries(GQLUSER_ROLE).map(
    ([label, value]) => label
  );

  if (roleEntries.includes(role)) {
    return [
      {
        type: AnalysisMessageType.Positive,
        message: "`user.role` appears to be valid.",
      },
    ];
  } else {
    return [
      {
        type: AnalysisMessageType.Error,
        message: `\`user.role\` is invalid. Value must be one of ${roleEntries.join(
          ", "
        )}`,
      },
    ];
  }
};

const analyseTokenPayload = (
  payload: string | jwt.JwtPayload | undefined | null
): PayloadComment[] => {
  if (!payload) {
    return [
      { type: AnalysisMessageType.Error, message: "Payload is null or empty" },
    ];
  }

  const possible = payload as PossibleSSOPayloadStructure;
  if (!possible) {
    return [
      {
        type: AnalysisMessageType.Error,
        message:
          "Payload does not match expect structure of a Coral SSO token.",
      },
    ];
  }

  if (!possible.user) {
    return [
      {
        type: AnalysisMessageType.Error,
        message: "Payload does not define a `user` object.",
      },
    ];
  }

  const analysis: PayloadComment[] = [];

  analysis.push(...analyseId(possible.user.id));
  analysis.push(...analyseEmail(possible.user.email));
  analysis.push(...analyseUsername(possible.user.username));
  analysis.push(...analyseRole(possible.user.role));

  return analysis;
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

    const analysis = analyseTokenPayload(decodedToken);

    res.send(
      renderIndex(
        [],
        cleanToken,
        JSON.stringify(decodedToken, null, 2).trim(),
        analysis
      )
    );
  };
};

export const createTokenTestRouter = (options: AppOptions) => {
  const router = Router();

  router.get("/", indexHandler(options));
  router.post("/", bodyParser.urlencoded(), submitHandler(options));

  return router;
};
