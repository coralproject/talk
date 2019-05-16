import {
  doesRequireSchemePrefixing,
  extractParentsOrigin,
  prefixSchemeIfRequired,
} from "coral-server/app/url";
import { Request } from "express";

it("extracts the url when the parentUrl is not provided", () => {
  const req = { headers: {}, query: {} } as Request;

  expect(extractParentsOrigin(req)).toEqual(null);
});

it("extracts the url when the parentUrl is provided but is empty", () => {
  const req = { headers: {}, query: { parentUrl: "" } } as Request;

  expect(extractParentsOrigin(req)).toEqual(null);
});

it("extracts the url when the parentUrl is provided", () => {
  const req = {
    headers: {},
    query: { parentUrl: "https://coralproject.net/" },
  } as Request;

  expect(extractParentsOrigin(req)).toEqual("https://coralproject.net");
});

it("extracts the url when the referer header is provided but is empty", () => {
  const req = { headers: {}, query: {} } as Request;

  req.headers.referer = "";

  expect(extractParentsOrigin(req)).toEqual(null);
});

it("extracts the url when the referer header is provided", () => {
  const req = {
    headers: {},
    query: {},
  } as Request;

  req.headers.referer = "https://coralproject.net/";

  expect(extractParentsOrigin(req)).toEqual("https://coralproject.net");
});

it("does not do any prefixing", () => {
  expect(prefixSchemeIfRequired(true, "https://coralproject.net")).toEqual(
    "https://coralproject.net"
  );
});

it("prefixes the url with https://", () => {
  expect(prefixSchemeIfRequired(true, "coralproject.net")).toEqual(
    "https://coralproject.net"
  );
});

it("prefixes the url with http://", () => {
  expect(prefixSchemeIfRequired(false, "coralproject.net")).toEqual(
    "http://coralproject.net"
  );
});

it("prefixes the url with http://", () => {
  expect(prefixSchemeIfRequired(false, "//coralproject.net")).toEqual(
    "http://coralproject.net"
  );
});

it("determines prefixing requirements correctly", () => {
  expect(doesRequireSchemePrefixing("")).toEqual(true);
  expect(doesRequireSchemePrefixing("coralproject.net")).toEqual(true);
  expect(doesRequireSchemePrefixing("localhost:8080")).toEqual(true);
  expect(doesRequireSchemePrefixing("http://coralproject.net")).toEqual(false);
  expect(doesRequireSchemePrefixing("https://coralproject.net")).toEqual(false);
  expect(doesRequireSchemePrefixing("http://localhost:8080")).toEqual(false);
  expect(doesRequireSchemePrefixing("https://localhost:8080")).toEqual(false);
});
