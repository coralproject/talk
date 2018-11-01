import { isURLPermitted } from "talk-server/services/stories";

it("denies when the tenant has no specified domains", () => {
  const tenant = { domains: [] };

  expect(isURLPermitted(tenant, "")).toEqual(false);
});

it("denies when tenant has a domain but not a valid url", () => {
  const tenant = { domains: ["https://coralproject.net"] };

  expect(isURLPermitted(tenant, "")).toEqual(false);
});

it("denies when there are multiple tenants domains and not a valid url", () => {
  const tenant = {
    domains: ["https://coralproject.net", "https://news.coralproject.net"],
  };

  expect(isURLPermitted(tenant, "")).toEqual(false);
});

it("denies when there are multiple tenants domains and a invalid url", () => {
  const tenant = {
    domains: ["https://coralproject.net", "https://news.coralproject.net"],
  };

  expect(
    isURLPermitted(tenant, "https://blog.coralproject.net/a/page")
  ).toEqual(false);
});

it("allows when there are multiple tenants domains and a valid url", () => {
  const tenant = {
    domains: ["https://coralproject.net", "https://news.coralproject.net"],
  };

  expect(
    isURLPermitted(tenant, "https://news.coralproject.net/a/page")
  ).toEqual(true);
});

it("allows when there are multiple prefix domains and a valid url", () => {
  const tenant = {
    domains: ["coralproject.net", "news.coralproject.net"],
  };

  expect(isURLPermitted(tenant, "http://news.coralproject.net/a/page")).toEqual(
    true
  );
});

it("allows when there are some prefix domains and a valid url", () => {
  const tenant = {
    domains: ["http://coralproject.net", "news.coralproject.net"],
  };

  expect(
    isURLPermitted(tenant, "https://news.coralproject.net/a/page")
  ).toEqual(true);
});
