import {
  doesRequireSchemePrefixing,
  prefixSchemeIfRequired,
} from "coral-server/app/url";

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
