import { Site } from "coral-server/models/site";

import { isURLPermitted } from "./url";

type PartialSite = Pick<Site, "allowedDomains">;

function createSite(input: Partial<PartialSite> = {}): PartialSite {
  if (!input.allowedDomains) {
    input.allowedDomains = [];
  }

  return input as PartialSite;
}

it("denies when the site has no specified domains", () => {
  const site = { allowedDomains: [] };

  expect(isURLPermitted(site, "")).toEqual(false);
});

it("denies when site has a domain but not a valid url", () => {
  const site = createSite({ allowedDomains: ["https://coralproject.net"] });

  expect(isURLPermitted(site, "")).toEqual(false);
});

it("denies when there are multiple sites allowedDomains and not a valid url", () => {
  const site = createSite({
    allowedDomains: [
      "https://coralproject.net",
      "https://news.coralproject.net",
    ],
  });

  expect(isURLPermitted(site, "")).toEqual(false);
});

it("denies when there are multiple sites allowedDomains and a invalid url", () => {
  const site = createSite({
    allowedDomains: [
      "https://coralproject.net",
      "https://news.coralproject.net",
    ],
  });

  expect(isURLPermitted(site, "https://blog.coralproject.net/a/page")).toEqual(
    false
  );
});

it("allows when there are multiple sites allowedDomains and a valid url", () => {
  const site = createSite({
    allowedDomains: [
      "https://coralproject.net",
      "https://news.coralproject.net",
    ],
  });

  expect(isURLPermitted(site, "https://news.coralproject.net/a/page")).toEqual(
    true
  );
});

it("allows when there are multiple prefix allowedDomains and a valid url", () => {
  const site = createSite({
    allowedDomains: ["coralproject.net", "news.coralproject.net"],
  });

  expect(isURLPermitted(site, "http://news.coralproject.net/a/page")).toEqual(
    true
  );
});

it("allows when there are some prefix allowedDomains and a valid url", () => {
  const site = createSite({
    allowedDomains: ["http://coralproject.net", "news.coralproject.net"],
  });

  expect(isURLPermitted(site, "https://news.coralproject.net/a/page")).toEqual(
    true
  );
});
