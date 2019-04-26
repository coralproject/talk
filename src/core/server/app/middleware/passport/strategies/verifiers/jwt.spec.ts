import jwt from "jsonwebtoken";

import {
  JWTSigningConfig,
  signTokenString,
  SymmetricSigningAlgorithm,
} from "talk-server/services/jwt";
import { isJWTToken } from "./jwt";

// Create signing config.
const config: JWTSigningConfig = {
  algorithm: SymmetricSigningAlgorithm.HS256,
  secret: "secret",
};

it("validates a jwt token", async () => {
  const user = { id: "user-id" };
  const tenant = { id: "tenant-id" };

  // Create the signed token string.
  const tokenString = await signTokenString(config, user, tenant);

  // Verify that the token conforms to the JWT token schema.
  const token = jwt.decode(tokenString) as object;

  expect(isJWTToken(token)).toBeTruthy();
});
