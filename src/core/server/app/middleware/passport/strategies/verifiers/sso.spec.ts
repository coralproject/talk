import {
  SSOTokenSchema,
  SSOUserProfileSchema,
  validateToken,
} from "coral-server/app/middleware/passport/strategies/verifiers/sso";
import { validate } from "coral-server/app/request/body";

describe("isSSOToken", () => {
  it("understands valid sso tokens", () => {
    const token = {
      user: {
        id: "id",
        email: "email",
        username: "username",
        role: "COMMENTER",
      },
    };
    expect(validateToken(token)).toBeUndefined();
  });

  it("understands invalid sso tokens", () => {
    expect(
      validateToken({ user: { id: "id", email: "email" } } as object)
    ).toEqual('SSO: "user.username" is required');
    expect(
      validateToken({ user: { id: "id", username: "username" } } as object)
    ).toEqual('SSO: "user.email" is required');
    expect(
      validateToken({
        user: { email: "email", username: "username" },
      } as object)
    ).toEqual('SSO: "user.id" is required');
    expect(
      validateToken({
        user: {
          email: "email",
          username: "username",
          role: "SUPERADMIN",
        },
      } as object)
    ).toEqual('SSO: "user.id" is required');
    expect(validateToken({})).toEqual('SSO: "user" is required');
  });
});

describe("SSOUserProfileSchema", () => {
  it("allows a valid payload", () => {
    const profile = {
      id: "id",
      email: "email",
      username: "username",
    };

    expect(validate(SSOUserProfileSchema, profile)).toEqual(profile);
    expect(validateToken({ user: profile })).toBeUndefined();
  });

  it("allows unknown claims", async () => {
    const extra = {
      preferred_username: "username",
    };
    const base = {
      user: {
        id: "id",
        email: "email",
        username: "username",
      },
    };
    const token = {
      ...extra,
      ...base,
    };

    expect(validate(SSOTokenSchema, token)).toEqual(base);
    expect(validateToken(token)).toBeUndefined();
  });
});
