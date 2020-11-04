import { validateSchema } from "coral-server/helpers";

import { OIDCIDTokenSchema } from "./oidc";

describe("OIDCIDTokenSchema", () => {
  it("allows a valid payload", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
      exp: Math.round(Date.now() / 1000) + 2000,
      email_verified: true,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual(token);
  });

  it("allows an empty email_verified", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
      exp: Math.round(Date.now() / 1000) + 2000,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual({
      ...token,
      email_verified: false,
    });
  });

  it("allows an empty picture", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
      exp: Math.round(Date.now() / 1000) + 2000,
      email_verified: true,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual(token);
  });

  it("allows a valid payload", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
      email_verified: true,
      name: "name",
      nickname: "nickname",
      exp: Math.round(Date.now() / 1000) + 2000,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual(token);
  });

  it("allows an empty name", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
      email_verified: false,
      nickname: "nickname",
      exp: Math.round(Date.now() / 1000) + 2000,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual(token);
  });

  it("allows an empty nickname", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
      email_verified: false,
      name: "name",
      exp: Math.round(Date.now() / 1000) + 2000,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual(token);
  });
});
