import { AuthenticationError } from "apollo-server-express";
import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { MongoContext } from "coral-server/data/context";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

const JobStatusQuerySchema = Joi.object().keys({
  name: Joi.string().required(),
});

interface JobStatusQuery {
  name: string;
}

interface JobStatus {
  name: string;
  processed: number;
  total: number;
  percentage: number;
}

const getJobStatus = async (
  name: string,
  mongo: MongoContext,
  tenantID: string
): Promise<JobStatus | null> => {
  const lowerName = name.toLowerCase();
  if (lowerName === "regeneratestorytrees") {
    const total = await mongo
      .stories()
      .find({ tenantID, isArchived: { $exists: false } })
      .count();

    const processed = await mongo
      .stories()
      .find({ tenantID, tree: { $exists: true } })
      .count();

    return {
      name,
      processed,
      total,
      percentage: (processed / total) * 100.0,
    };
  }

  return null;
};

export const jobStatusHandler = ({
  mongo,
  redis,
  config,
}: AppOptions): RequestHandler<TenantCoralRequest> => {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "1m",
    max: 2,
    prefix: "ip",
    config,
  });

  return async (req, res, next) => {
    try {
      await ipLimiter.test(req, req.ip);

      const { tenant } = req.coral;

      const requestingUser = req.user;
      if (!requestingUser) {
        throw new AuthenticationError("no user on request");
      }

      if (requestingUser.role !== GQLUSER_ROLE.ADMIN) {
        throw new AuthenticationError("user must be an admin");
      }

      const { name }: JobStatusQuery = validate(JobStatusQuerySchema, req.body);

      const status = await getJobStatus(name, mongo, tenant.id);

      if (!status) {
        return res.status(400).end();
      }

      return res.send(status);
    } catch (err) {
      return res.status(400).end();
    }
  };
};
