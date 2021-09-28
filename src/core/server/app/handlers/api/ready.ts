import { F_OK } from "constants";
import { RequestHandler } from "express";
import fs from "fs";

/**
 * The readiness handler will always return 200 unless
 * it finds a MAINTENANCE file under the root folder in which it
 * will send a 500 code.
 *
 * If the orchestration platform such as Kubernetes is configured with a
 * readiness probe on this endpoint `/api/ready` it will seize to serve
 * any traffic to this process.
 *
 * It can take up to 7 minutes until no traffic is being handled anymore.
 */
export const readyHandler: RequestHandler = async (req, res, next) => {
  try {
    await fs.promises.access("./MAINTENANCE", F_OK);
    res
      .status(500)
      .send(
        "Currently under maintenance. To resume remove the MAINTENANCE file."
      );
  } catch {
    res.status(200).send("OK");
  }
};
