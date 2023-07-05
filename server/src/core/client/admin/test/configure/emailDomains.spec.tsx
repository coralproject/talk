import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import { emailDomain, settings, users } from "../fixtures";

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
        },
      }),
      params.resolvers
    ),
  });
  return {
    testRenderer,
  };
}

it("adds email domains to ban new users on", async () => {
  replaceHistoryLocation(
    "http://localhost/admin/configure/moderation/domains/add"
  );
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      createEmailDomain: ({ variables }) => {
        expectAndFail(variables.domain).toEqual("email.com");
        expectAndFail(variables.newUserModeration).toEqual("BAN");
        return {
          settings: pureMerge(settings, {
            emailDomainModeration: [
              {
                id: "1a60424a-c116-483a-b315-837a7fd5b496",
                domain: "email.com",
                newUserModeration: "BAN",
              },
            ],
          }),
        };
      },
    },
  });

  const { testRenderer } = await createTestRenderer({ resolvers });

  const addEmailDomainConfig = await waitForElement(() =>
    within(testRenderer.root).getByTestID(
      "configure-moderation-emailDomains-add"
    )
  );

  const form = within(addEmailDomainConfig).getByType("form");

  act(() => {
    form.props.onSubmit();
  });

  // Check that expected validation errors are displayed
  expect(
    within(addEmailDomainConfig).getByText("This field is required.")
  ).toBeDefined();

  const domainField = within(addEmailDomainConfig).getByTestID(
    "configure-moderation-emailDomains-domainTextField"
  );

  act(() => domainField.props.onChange("@email.com"));

  expect(
    within(addEmailDomainConfig).getByText(
      'Invalid email domain format. Please use "email.com"'
    )
  ).toBeDefined();

  act(() => domainField.props.onChange("email.com"));

  // Submit form with email domain
  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await wait(() => {
      expect(resolvers.Mutation!.createEmailDomain!.called).toBe(true);
    });
  });
});

it("updates email domains to ban users on", async () => {
  replaceHistoryLocation(
    "http://localhost/admin/configure/moderation/domains/1a60424a-c116-483a-b315-837a7fd5b496"
  );
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      emailDomain: () => emailDomain,
    },
    Mutation: {
      updateEmailDomain: ({ variables }) => {
        expectAndFail(variables.domain).toEqual("emailchanged.com");
        expectAndFail(variables.newUserModeration).toEqual("BAN");
        return {
          settings: pureMerge(settings, {
            emailDomainModeration: [
              {
                id: "1a60424a-c116-483a-b315-837a7fd5b496",
                domain: "emailchanged.com",
                newUserModeration: "BAN",
              },
            ],
          }),
        };
      },
    },
  });
  const { testRenderer } = await createTestRenderer({ resolvers });

  const updateEmailDomainConfig = await waitForElement(() =>
    within(testRenderer.root).getByTestID(
      "configure-moderation-emailDomains-update"
    )
  );
  const domainField = within(updateEmailDomainConfig).getByTestID(
    "configure-moderation-emailDomains-domainTextField"
  );

  act(() => domainField.props.onChange("emailchanged.com"));

  const form = within(updateEmailDomainConfig).getByType("form");

  // submits form with updated email domain
  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await wait(() => {
      expect(resolvers.Mutation!.updateEmailDomain!.called).toBe(true);
    });
  });
});
