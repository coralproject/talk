import jwt from "jsonwebtoken";
import { DateTime } from "luxon";

import {
  JWTSigningConfig,
  signTokenString,
  SymmetricSigningAlgorithm,
} from "coral-server/services/jwt";

import { isJWTToken, JWTToken } from "./jwt";

// Create signing config.
const config: JWTSigningConfig = {
  algorithm: SymmetricSigningAlgorithm.HS256,
  secret: "secret",
};

it("validates a jwt token", async () => {
  const user = { id: "user-id" };
  const tenant = { id: "tenant-id", auth: { sessionDuration: 100 } };

  // Get the time.
  const now = new Date();
  now.setMilliseconds(0);

  // Create the signed token string.
  const tokenString = await signTokenString(config, user, tenant, {}, now);

  // Verify that the token conforms to the JWT token schema.
  const token = jwt.decode(tokenString) as object;

  expect(isJWTToken(token)).toBeTruthy();
  expect((token as JWTToken).exp).toBe(
    DateTime.fromJSDate(now)
      .plus({ seconds: 100 })
      .toSeconds()
  );
});
