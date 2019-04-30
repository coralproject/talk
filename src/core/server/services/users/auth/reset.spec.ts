import uuid from "uuid/v1";

import { isResetToken, ResetToken } from "./reset";

function createToken(partial: Partial<ResetToken> | any = {}): ResetToken {
  const now = Math.floor(Date.now() / 1000);
  const token: ResetToken = {
    sub: uuid(),
    jti: uuid(),
    iss: uuid(),
    exp: now + 60 * 60 * 24,
    nbf: now,
    iat: now,
    aud: "reset",
    rid: uuid(),
    ruri: "http://coralproject.net",
  };

  return {
    ...token,
    ...partial,
  };
}

describe("isResetToken", () => {
  it("validates a valid reset token", () => {
    expect(isResetToken(createToken())).toBeTruthy();
  });

  it("rejects an invalid aud value in a token", () => {
    expect(isResetToken(createToken({ aud: "not-reset" }))).toBeFalsy();
  });

  it("rejects an invalid ruri value in a token", () => {
    expect(isResetToken(createToken({ ruri: "not-a-uri" }))).toBeFalsy();
  });
});
