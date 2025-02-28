import {
  createTenantFixture,
  createUserFixture,
} from "coral-server/test/fixtures";

import {
  EMAIL_PREMOD_FILTER_PERIOD_LIMIT,
  shouldPremodDueToLikelySpamEmail,
} from "./emailPremodFilter";

const tooManyPeriodsEmail = "this.has.too.many.periods@test.com";
const justEnoughPeriodsEmail = "just.enough.periods@test.com";
const noPeriodsEmail = "noperiodshere@test.com";

const isSubdomainEmail = "test@thisisa.subdomain.com";
const isNotSubdomainEmail = "test@regulardomain.com";

it("does not premod filter emails when feature is disabled", () => {
  const tenant = createTenantFixture({
    premoderateEmailAddress: {
      tooManyPeriods: {
        enabled: false,
      },
    },
  });

  const user = createUserFixture({
    email: tooManyPeriodsEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(undefined, tenant, user);
  expect(!result);
});

it(`does not premod filter emails when feature enabled and has less than ${EMAIL_PREMOD_FILTER_PERIOD_LIMIT} periods`, () => {
  const tenant = createTenantFixture({
    premoderateEmailAddress: {
      tooManyPeriods: {
        enabled: true,
      },
    },
  });

  const user = createUserFixture({
    email: justEnoughPeriodsEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(undefined, tenant, user);
  expect(result);
});

it(`does not premod filter emails when feature enabled and has no periods`, () => {
  const tenant = createTenantFixture({
    premoderateEmailAddress: {
      tooManyPeriods: {
        enabled: true,
      },
    },
  });

  const user = createUserFixture({
    email: noPeriodsEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(undefined, tenant, user);
  expect(result);
});

it(`does premod filter emails when feature is enabled and has too many (${EMAIL_PREMOD_FILTER_PERIOD_LIMIT} or more) periods`, () => {
  const tenant = createTenantFixture({
    premoderateEmailAddress: {
      tooManyPeriods: {
        enabled: true,
      },
    },
  });

  const user = createUserFixture({
    email: tooManyPeriodsEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(undefined, tenant, user);
  expect(result);
});

it("does not premod filter emails when domain alias feature is disabled", () => {
  const tenant = createTenantFixture({
    premoderateEmailAddress: {
      domainAliases: {
        enabled: false,
      },
    },
  });

  const user = createUserFixture({
    email: isSubdomainEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(undefined, tenant, user);
  expect(!result);
});

it("does premod filter emails when domain alias feature is enabled and email is subdomain", () => {
  const tenant = createTenantFixture({
    premoderateEmailAddress: {
      domainAliases: {
        enabled: true,
      },
    },
  });

  const user = createUserFixture({
    email: isSubdomainEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(undefined, tenant, user);
  expect(result);
});

it("does not premod filter emails when domain alias feature is enabled and email is not subdomain", () => {
  const tenant = createTenantFixture({
    premoderateEmailAddress: {
      domainAliases: {
        enabled: true,
      },
    },
  });

  const user = createUserFixture({
    email: isNotSubdomainEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(undefined, tenant, user);
  expect(result);
});
