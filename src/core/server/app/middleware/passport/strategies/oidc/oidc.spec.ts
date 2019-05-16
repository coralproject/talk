import { OIDCIDTokenSchema } from "coral-server/app/middleware/passport/strategies/oidc";
import { validate } from "coral-server/app/request/body";

describe("OIDCIDTokenSchema", () => {
  it("allows a valid payload", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
      email_verified: true,
    };

    expect(validate(OIDCIDTokenSchema, token)).toEqual(token);
  });

  it("allows an empty email_verified", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
    };

    expect(validate(OIDCIDTokenSchema, token)).toEqual({
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
      email_verified: true,
    };

    expect(validate(OIDCIDTokenSchema, token)).toEqual(token);
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
    };

    expect(validate(OIDCIDTokenSchema, token)).toEqual(token);
  });

  it("allows an empty name", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
      email_verified: false,
      nickname: "nickname",
    };

    expect(validate(OIDCIDTokenSchema, token)).toEqual(token);
  });

  it("allows an empty nickname", () => {
    const token = {
      sub: "sub",
      iss: "iss",
      aud: "aud",
      email: "email",
      email_verified: false,
      name: "name",
    };

    expect(validate(OIDCIDTokenSchema, token)).toEqual(token);
  });
});
