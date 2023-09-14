import { Request } from "coral-server/types/express";
import { getOrigin } from "../url";

/**
 * getRequesterOrigin will get the origin of the requester from the request.
 *
 * @param req the request to get the origin from
 */
function getRequesterOrigin(req: Request): string | null {
  const { referer } = req.headers;
  if (!referer) {
    return null;
  }

  return getOrigin(referer);
}

export default getRequesterOrigin;
