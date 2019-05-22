import auth from "basic-auth";
import compare from "tsscmp";

import { RequestHandler } from "coral-server/types/express";

export const basicAuth = (
  username: string,
  password: string
): RequestHandler => {
  function check(name: string, pass: string) {
    let valid = true;

    // Simple method to prevent short-circuit and use timing-safe compare.
    valid = compare(name, username) && valid;
    valid = compare(pass, password) && valid;

    return valid;
  }

  return (req, res, next) => {
    // Pull the credentials out of the request.
    const credentials = auth(req);

    // Check credentials
    if (credentials && check(credentials.name, credentials.pass)) {
      return next();
    }

    res.setHeader("WWW-Authenticate", `Basic realm="${req.originalUrl}"`);
    res.status(401).send("Access denied");
  };
};
