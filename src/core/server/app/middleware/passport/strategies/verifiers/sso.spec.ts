import {
  isSSOToken,
  SSOUserProfileSchema,
} from "talk-server/app/middleware/passport/strategies/verifiers/sso";
import { validate } from "talk-server/app/request/body";

describe("isSSOToken", () => {
  it("understands valid sso tokens", () => {
    const token = { user: { id: "id", email: "email", username: "username" } };
    expect(isSSOToken(token)).toBeTruthy();
  });

  it("understands invalid sso tokens", () => {
    expect(isSSOToken({ user: { id: "id", email: "email" } })).toBeFalsy();
    expect(
      isSSOToken({ user: { id: "id", username: "username" } })
    ).toBeFalsy();
    expect(
      isSSOToken({ user: { email: "email", username: "username" } })
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
      avatar: "avatar",
    };

    expect(validate(SSOUserProfileSchema, profile)).toEqual(profile);
  });

  it("allows an empty avatar", () => {
    const profile = {
      id: "id",
      email: "email",
      username: "username",
    };

    expect(validate(SSOUserProfileSchema, profile)).toEqual(profile);
  });

  it("allows a valid payload", () => {
    const profile = {
      id: "id",
      email: "email",
      username: "username",
      avatar: "avatar",
      displayName: "displayName",
    };

    expect(validate(SSOUserProfileSchema, profile)).toEqual(profile);
  });

  it("allows an empty avatar", () => {
    const profile = {
      id: "id",
      email: "email",
      username: "username",
      displayName: "displayName",
    };

    expect(validate(SSOUserProfileSchema, profile)).toEqual(profile);
  });

  it("allows an empty displayName", () => {
    const profile = {
      id: "id",
      email: "email",
      username: "username",
      avatar: "avatar",
    };

    expect(validate(SSOUserProfileSchema, profile)).toEqual(profile);
  });
});
