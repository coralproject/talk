import { generateFrameOptions } from "talk-server/app/middleware/csp/tenant";
import { Request } from "talk-server/types/express";

it("denies when the tenant has no specified domains", () => {
  const tenant = { domains: [] };
  const req = {} as Request;

  expect(generateFrameOptions(req, tenant)).toEqual("deny");
});

it("allow-from single domain when there is one domain", () => {
  const tenant = { domains: ["https://coralproject.net"] };
  const req = {} as Request;

  expect(generateFrameOptions(req, tenant)).toEqual(
    "allow-from https://coralproject.net"
  );
});

it("deny from the domain when it does not provide and there are multiple tenants domains", () => {
  const tenant = {
    domains: ["https://coralproject.net", "https://news.coralproject.net"],
  };
  const req = { headers: {}, query: { parentUrl: "" } } as Request;

  expect(generateFrameOptions(req, tenant)).toEqual("deny");
});

it("allows from the domain when it does not provide a match and there are multiple tenants domains", () => {
  const tenant = {
    domains: ["https://coralproject.net", "https://news.coralproject.net"],
  };
  const req = {
    headers: {},
    query: { parentUrl: "https://blog.coralproject.net/a/page" },
  } as Request;

  expect(generateFrameOptions(req, tenant)).toEqual("deny");
});

it("allows from the domain when it does provide a match and there are multiple tenants domains", () => {
  const tenant = {
    domains: ["https://coralproject.net", "https://news.coralproject.net"],
  };
  const req = {
    headers: {},
    query: { parentUrl: "https://news.coralproject.net/a/page" },
  } as Request;

  expect(generateFrameOptions(req, tenant)).toEqual(
    "allow-from https://news.coralproject.net"
  );
});

it("it prefixes domains of the tenant when generating the frame option", () => {
  const tenant = {
    domains: ["coralproject.net", "news.coralproject.net"],
  };
  const req = {
    headers: {},
    query: { parentUrl: "http://news.coralproject.net/a/page" },
  } as Request;

  expect(generateFrameOptions(req, tenant)).toEqual(
    "allow-from http://news.coralproject.net"
  );
});

it("it prefixes domains of the tenant when generating the frame option", () => {
  const tenant = {
    domains: ["coralproject.net", "news.coralproject.net"],
  };
  const req = {
    headers: {},
    query: { parentUrl: "https://news.coralproject.net/a/page" },
  } as Request;

  expect(generateFrameOptions(req, tenant)).toEqual(
    "allow-from https://news.coralproject.net"
  );
});

it("it prefixes domains of the tenant when generating the frame option and denies based on it", () => {
  const tenant = {
    domains: ["coralproject.net", "news.coralproject.net"],
  };
  const req = {
    headers: {},
    query: { parentUrl: "http://news.coralproject.net/a/page" },
  } as Request;

  expect(generateFrameOptions(req, tenant)).toEqual(
    "allow-from http://news.coralproject.net"
  );
});
