import { generateFrameOptions } from "coral-server/app/middleware/csp";
import { Request } from "coral-server/types/express";

it("denies when there is no permitted origins", () => {
  const origins: string[] = [];
  const req = {} as Request;

  expect(generateFrameOptions(req, origins)).toEqual("deny");
});

it("denies when there is no permitted origins", () => {
  const origins: string[] = [];
  const req = {
    headers: { referer: "https://blog.coralproject.net/a/page" },
  } as Request;

  expect(generateFrameOptions(req, origins)).toEqual("deny");
});

it("denies when there is no referer", () => {
  const origins: string[] = [
    "https://coralproject.net",
    "https://news.coralproject.net",
  ];
  const req = { headers: {}, query: {} } as Request;

  expect(generateFrameOptions(req, origins)).toEqual("deny");
});

it("denies when the referer does not match a permitted origin", () => {
  const origins: string[] = [
    "https://coralproject.net",
    "https://news.coralproject.net",
  ];
  const req = {
    headers: { referer: "https://blog.coralproject.net/a/page" },
    query: {},
  } as Request;

  expect(generateFrameOptions(req, origins)).toEqual("deny");
});

it("allows when the referer matches a permitted origin", () => {
  const origins: string[] = [
    "https://coralproject.net",
    "https://news.coralproject.net",
  ];
  const req = {
    headers: { referer: "https://news.coralproject.net/a/page" },
    query: {},
  } as Request;

  expect(generateFrameOptions(req, origins)).toEqual(null);
});
