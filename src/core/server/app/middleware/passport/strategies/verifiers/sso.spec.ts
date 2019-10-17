import {
  isSSOToken,
  SSOTokenSchema,
  SSOUserProfileSchema,
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
    expect(isSSOToken(token)).toBeTruthy();
  });

  it("understands invalid sso tokens", () => {
    expect(
      isSSOToken({ user: { id: "id", email: "email" } } as object)
    ).toBeFalsy();
    expect(
      isSSOToken({ user: { id: "id", username: "username" } } as object)
    ).toBeFalsy();
    expect(
      isSSOToken({ user: { email: "email", username: "username" } } as object)
    ).toBeFalsy();
    expect(
      isSSOToken({
        user: {
          email: "email",
          username: "username",
          role: "SUPERADMIN",
        },
      } as object)
    ).toBeFalsy();
    expect(isSSOToken({})).toBeFalsy();
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
    expect(isSSOToken({ user: profile })).toEqual(true);
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
    expect(isSSOToken(token)).toEqual(true);
  });
});
