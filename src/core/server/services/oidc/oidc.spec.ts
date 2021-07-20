import { validateSchema } from "coral-server/helpers";

import { OIDCIDTokenSchema } from "./oidc";

describe("OIDCIDTokenSchema", () => {
  it("allows a valid payload", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email@address.com",
      exp: Math.round(Date.now() / 1000) + 2000,
      email_verified: true,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual(token);
  });

  it("lowercases an email address", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "Email@Address.Com",
      exp: Math.round(Date.now() / 1000) + 2000,
      email_verified: true,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual({
      ...token,
      email: "email@address.com",
    });
  });

  it("allows an empty email_verified", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email@address.com",
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
      email: "email@address.com",
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
      email: "email@address.com",
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
      email: "email@address.com",
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
      email: "email@address.com",
      email_verified: false,
      name: "name",
      exp: Math.round(Date.now() / 1000) + 2000,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual(token);
  });

  it("allows an empty email", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      name: "name",
      exp: Math.round(Date.now() / 1000) + 2000,
      nonce: "nonce",
    };

    expect(validateSchema(OIDCIDTokenSchema, token)).toEqual({
      ...token,
      email_verified: false,
    });
  });
});
