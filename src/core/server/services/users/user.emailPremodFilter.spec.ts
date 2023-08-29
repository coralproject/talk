import {
  createTenantFixture,
  createUserFixture,
} from "coral-server/test/fixtures";

import { GQLFEATURE_FLAG } from "coral-server/graph/schema/__generated__/types";

import {
  EMAIL_PREMOD_FILTER_PERIOD_LIMIT,
  shouldPremodDueToLikelySpamEmail,
} from "./emailPremodFilter";

const tooManyPeriodsEmail = "this.has.too.many.periods@test.com";
const justEnoughPeriodsEmail = "just.enough.periods@test.com";
const noPeriodsEmail = "noperiodshere@test.com";

it("does not premod filter emails when feature flag is disabled", () => {
  const tenant = createTenantFixture({
    featureFlags: [],
  });

  const user = createUserFixture({
    email: tooManyPeriodsEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(tenant, user);
  expect(!result);
});

it(`does not premod filter emails when feature flag enabled and has less than ${EMAIL_PREMOD_FILTER_PERIOD_LIMIT} periods`, () => {
  const tenant = createTenantFixture({
    featureFlags: [GQLFEATURE_FLAG.EMAIL_PREMOD_FILTER],
  });

  const user = createUserFixture({
    email: justEnoughPeriodsEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(tenant, user);
  expect(result);
});

it(`does not premod filter emails when feature flag enabled and has no periods`, () => {
  const tenant = createTenantFixture({
    featureFlags: [GQLFEATURE_FLAG.EMAIL_PREMOD_FILTER],
  });

  const user = createUserFixture({
    email: noPeriodsEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(tenant, user);
  expect(result);
});

it(`does premod filter emails when feature flag is enabled and has too many (${EMAIL_PREMOD_FILTER_PERIOD_LIMIT} or more) periods`, () => {
  const tenant = createTenantFixture({
    featureFlags: [GQLFEATURE_FLAG.EMAIL_PREMOD_FILTER],
  });

  const user = createUserFixture({
    email: tooManyPeriodsEmail,
  });

  const result = shouldPremodDueToLikelySpamEmail(tenant, user);
  expect(result);
});
