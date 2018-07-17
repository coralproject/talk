import sinon from "sinon";

import {
  extractJWTFromRequest,
  parseAuthHeader,
} from "talk-server/app/middleware/passport/jwt";
import { Request } from "talk-server/types/express";

describe("parseAuthHeader", () => {
  it("parses valid headers", () => {
    const parsed = {
      scheme: "bearer",
      value: "token",
    };

    expect(parseAuthHeader("Bearer token")).toEqual(parsed);

    expect(parseAuthHeader("bearer token")).toEqual(parsed);

    expect(parseAuthHeader("bearer  token")).toEqual(parsed);
  });

  it("parses invalid headers", () => {
    expect(parseAuthHeader("this-is-a-wrong-header")).toEqual(null);
    expect(parseAuthHeader("bearerthis-is-a-wrong-header")).toEqual(null);
  });
});

describe("extractJWTFromRequest", () => {
  it("extracts the token from header", () => {
    const req = {
      get: sinon
        .stub()
        .withArgs("authorization")
        .returns("Bearer token"),
    };

    expect(extractJWTFromRequest((req as any) as Request)).toEqual("token");
    expect(req.get.calledOnce).toBeTruthy();

    req.get.reset();
    req.get.returns(null);
    expect(extractJWTFromRequest((req as any) as Request)).toEqual(null);
    expect(req.get.calledOnce).toBeTruthy();
  });

  it("extracts the token from query string", () => {
    const req = {
      get: sinon
        .stub()
        .withArgs("authorization")
        .returns(null),
      query: { access_token: "token" },
    };

    expect(extractJWTFromRequest((req as any) as Request)).toEqual("token");
    expect(req.get.calledOnce).toBeTruthy();

    delete req.query.access_token;

    req.get.reset();
    expect(extractJWTFromRequest((req as any) as Request)).toEqual(null);
    expect(req.get.calledOnce).toBeTruthy();
  });
});
