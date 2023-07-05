import { v1 as uuid } from "uuid";

import { ConfirmToken, isConfirmToken } from "./confirm";

function createToken(partial: Partial<ConfirmToken> | any = {}): ConfirmToken {
  const now = Math.floor(Date.now() / 1000);
  const token: ConfirmToken = {
    sub: uuid(),
    jti: uuid(),
    iss: uuid(),
    exp: now + 60 * 60 * 24,
    nbf: now,
    iat: now,
    aud: "confirm",
    evid: uuid(),
    email: "email@address.com",
  };

  return {
    ...token,
    ...partial,
  };
}

describe("isConfirmToken", () => {
  it("validates a valid confirm token", () => {
    expect(isConfirmToken(createToken())).toBeTruthy();
  });

  it("rejects an invalid aud value in a token", () => {
    expect(isConfirmToken(createToken({ aud: "not-confirm" }))).toBeFalsy();
  });
});
