import { AuthenticationError } from "apollo-server-express";
import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { AugmentedRedis } from "coral-server/services/redis";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

const JobStatusQuerySchema = Joi.object().keys({
  name: Joi.string().required(),
  jobID: Joi.string().required(),
});

interface JobStatusQuery {
  name: string;
  jobID: string;
}

interface JobStatus {
  name: string;
  processed: number;
  total: number;
  percentage: number;
}

const getJobStatus = async (
  name: string,
  redis: AugmentedRedis,
  jobID: string
): Promise<JobStatus | null> => {
  const lowerName = name.toLowerCase();
  if (lowerName === "regeneratestorytrees") {
    const totalStr = await redis.get(`jobStatus:${jobID}:expectedTotal`);
    const completeStr = await redis.get(`jobStatus:${jobID}:completed`);

    const total = totalStr ? parseInt(totalStr, 10) : 0;
    const processed = completeStr ? parseInt(completeStr, 10) : 0;

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

      const requestingUser = req.user;
      if (!requestingUser) {
        throw new AuthenticationError("no user on request");
      }

      if (requestingUser.role !== GQLUSER_ROLE.ADMIN) {
        throw new AuthenticationError("user must be an admin");
      }

      const { name, jobID }: JobStatusQuery = validate(
        JobStatusQuerySchema,
        req.body
      );

      const status = await getJobStatus(name, redis, jobID);

      if (!status) {
        return res.status(400).end();
      }

      return res.send(status);
    } catch (err) {
      return res.status(400).end();
    }
  };
};
