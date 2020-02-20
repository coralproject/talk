import { generateFrameOptions } from "coral-server/app/middleware/csp/tenant";
import { Request } from "coral-server/types/express";

it("denies when the tenant has no specified domains", () => {
  const origins: string[] = [];
  const req = {} as Request;

  expect(generateFrameOptions(req, origins)).toEqual("deny");
});

it("allow-from single domain when there is one domain", () => {
  const origins: string[] = ["https://coralproject.net"];
  const req = {} as Request;

  expect(generateFrameOptions(req, origins)).toEqual(
    "allow-from https://coralproject.net"
  );
});

it("deny from the domain when it does not provide and there are multiple tenants domains", () => {
  const origins: string[] = [
    "https://coralproject.net",
    "https://news.coralproject.net",
  ];
  const req = { headers: {}, query: { parentUrl: "" } } as Request;

  expect(generateFrameOptions(req, origins)).toEqual("deny");
});

it("allows from the domain when it does not provide a match and there are multiple tenants domains", () => {
  const origins: string[] = [
    "https://coralproject.net",
    "https://news.coralproject.net",
  ];
  const req = {
    headers: {},
    query: { parentUrl: "https://blog.coralproject.net/a/page" },
  } as Request;

  expect(generateFrameOptions(req, origins)).toEqual("deny");
});

it("allows from the domain when it does provide a match and there are multiple tenants domains", () => {
  const origins: string[] = [
    "https://coralproject.net",
    "https://news.coralproject.net",
  ];
  const req = {
    headers: {},
    query: { parentUrl: "https://news.coralproject.net/a/page" },
  } as Request;

  expect(generateFrameOptions(req, origins)).toEqual(
    "allow-from https://news.coralproject.net"
  );
});
