import { AppOptions } from "coral-server/app";
import { RequestHandler } from "coral-server/types/express";

export type DownloadOptions = Pick<AppOptions, "mongo" | "redis">;

export const downloadHandler = ({
  redis,
  mongo,
}: DownloadOptions): RequestHandler => {
  return async (req, res, next) => {
    res.send({ message: "hello" });
  };
};
