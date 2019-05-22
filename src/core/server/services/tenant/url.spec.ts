import { Tenant } from "coral-server/models/tenant";
import { isURLPermitted } from "coral-server/services/tenant/url";

type PartialTenant = Pick<Tenant, "domains" | "domain">;

function createTenant(input: Partial<PartialTenant> = {}): PartialTenant {
  if (!input.domain) {
    input.domain = "";
  }

  if (!input.domains) {
    input.domains = [];
  }

  return input as PartialTenant;
}

it("denies when the tenant has no specified domains", () => {
  const tenant = { domains: [] };

  expect(isURLPermitted(tenant, "")).toEqual(false);
});

it("denies when tenant has a domain but not a valid url", () => {
  const tenant = createTenant({ domains: ["https://coralproject.net"] });

  expect(isURLPermitted(tenant, "")).toEqual(false);
});

it("denies when there are multiple tenants domains and not a valid url", () => {
  const tenant = createTenant({
    domains: ["https://coralproject.net", "https://news.coralproject.net"],
  });

  expect(isURLPermitted(tenant, "")).toEqual(false);
});

it("denies when there are multiple tenants domains and a invalid url", () => {
  const tenant = createTenant({
    domains: ["https://coralproject.net", "https://news.coralproject.net"],
  });

  expect(
    isURLPermitted(tenant, "https://blog.coralproject.net/a/page")
  ).toEqual(false);
});

it("allows when there are multiple tenants domains and a valid url", () => {
  const tenant = createTenant({
    domains: ["https://coralproject.net", "https://news.coralproject.net"],
  });

  expect(
    isURLPermitted(tenant, "https://news.coralproject.net/a/page")
  ).toEqual(true);
});

it("allows when there are multiple prefix domains and a valid url", () => {
  const tenant = createTenant({
    domains: ["coralproject.net", "news.coralproject.net"],
  });

  expect(isURLPermitted(tenant, "http://news.coralproject.net/a/page")).toEqual(
    true
  );
});

it("allows when there are some prefix domains and a valid url", () => {
  const tenant = createTenant({
    domains: ["http://coralproject.net", "news.coralproject.net"],
  });

  expect(
    isURLPermitted(tenant, "https://news.coralproject.net/a/page")
  ).toEqual(true);
});

it("allows and validates with the tenant domain", () => {
  const tenant = createTenant({
    domain: "coralproject.net",
  });

  expect(
    isURLPermitted(tenant, "https://coralproject.net/admin/login", true)
  ).toEqual(true);
});

it("denies and validates with the tenant domain", () => {
  const tenant = createTenant({
    domain: "coral.coralproject.net",
  });

  expect(
    isURLPermitted(tenant, "https://coralproject.net/admin/login", true)
  ).toEqual(false);
});
