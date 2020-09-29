import { Request } from "coral-server/types/express";
import { extractTokenFromRequest } from "./jwt";

function createRequest(req: Pick<Request, "url" | "headers">): Request {
  return req as Request;
}

describe("extractJWTFromRequest", () => {
  it("extracts the token from header", () => {
    const req = createRequest({
      headers: {
        authorization: "Bearer token",
      },
      url: "",
    });

    expect(extractTokenFromRequest(req)).toEqual("token");

    delete req.headers.authorization;

    expect(extractTokenFromRequest(req)).toEqual(null);
  });

  it("extracts the token from query string", () => {
    const req = createRequest({
      url: "https://coral.coralproject.net/api",
      headers: {},
    });

    expect(extractTokenFromRequest(req)).toEqual(null);

    req.url = "https://coral.coralproject.net/api?accessToken=token";

    expect(extractTokenFromRequest(req)).toEqual("token");
  });

  it("does not extract the token from query string when it's disabled", () => {
    const req = createRequest({
      url: "https://coral.coralproject.net/api?accessToken=token",
      headers: {},
    });

    expect(extractTokenFromRequest(req, true)).toEqual(null);
  });
});
