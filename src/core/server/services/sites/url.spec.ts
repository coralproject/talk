import { Site } from "coral-server/models/site";

import { isURLPermitted } from "./url";

type PartialSite = Pick<Site, "allowedOrigins">;

function createSite(input: Partial<PartialSite> = {}): PartialSite {
  if (!input.allowedOrigins) {
    input.allowedOrigins = [];
  }

  return input as PartialSite;
}

it("denies when the site has no specified domains", () => {
  const site = { allowedOrigins: [] };

  expect(isURLPermitted(site, "")).toEqual(false);
});

it("denies when site has a domain but not a valid url", () => {
  const site = createSite({ allowedOrigins: ["https://coralproject.net"] });

  expect(isURLPermitted(site, "")).toEqual(false);
});

it("denies when there are multiple sites allowedOrigins and not a valid url", () => {
  const site = createSite({
    allowedOrigins: [
      "https://coralproject.net",
      "https://news.coralproject.net",
    ],
  });

  expect(isURLPermitted(site, "")).toEqual(false);
});

it("denies when there are multiple sites allowedOrigins and a invalid url", () => {
  const site = createSite({
    allowedOrigins: [
      "https://coralproject.net",
      "https://news.coralproject.net",
    ],
  });

  expect(isURLPermitted(site, "https://blog.coralproject.net/a/page")).toEqual(
    false
  );
});

it("allows when there are multiple sites allowedOrigins and a valid url", () => {
  const site = createSite({
    allowedOrigins: [
      "https://coralproject.net",
      "https://news.coralproject.net",
    ],
  });

  expect(isURLPermitted(site, "https://news.coralproject.net/a/page")).toEqual(
    true
  );
});

it("allows when there are multiple prefix allowedOrigins and a valid url", () => {
  const site = createSite({
    allowedOrigins: ["coralproject.net", "news.coralproject.net"],
  });

  expect(isURLPermitted(site, "http://news.coralproject.net/a/page")).toEqual(
    true
  );
});

it("allows when there are some prefix allowedOrigins and a valid url", () => {
  const site = createSite({
    allowedOrigins: ["http://coralproject.net", "news.coralproject.net"],
  });

  expect(isURLPermitted(site, "https://news.coralproject.net/a/page")).toEqual(
    true
  );
});
