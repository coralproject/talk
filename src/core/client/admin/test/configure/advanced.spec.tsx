import { noop } from "lodash";

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
import { settings, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/advanced");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
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
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  const configureContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("configure-container")
  );
  const advancedContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-advancedContainer")
  );
  const saveChangesButton = within(configureContainer).getByTestID(
    "configure-sideBar-saveChanges"
  );
  return {
    context,
    testRenderer,
    configureContainer,
    advancedContainer,
    saveChangesButton,
  };
}

it("renders configure advanced", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change custom css", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.customCSSURL).toEqual("./custom.css");
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { configureContainer, advancedContainer, saveChangesButton } =
    await createTestRenderer({
      resolvers,
    });

  const customCSSField = within(advancedContainer).getByLabelText("Custom CSS");

  // Let's change the customCSS field.
  act(() => customCSSField.props.onChange("./custom.css"));

  // Send form
  act(() => {
    within(configureContainer)
      .getByType("form")
      .props.onSubmit({ preventDefault: noop });
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(customCSSField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(customCSSField.props.disabled).toBe(false);
    });
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("remove custom css", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () =>
        pureMerge<typeof settings>(settings, {
          customCSSURL: "./custom.css",
        }),
    },
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.customCSSURL).toBeNull();
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { configureContainer, advancedContainer } = await createTestRenderer({
    resolvers,
  });

  const customCSSField = within(advancedContainer).getByLabelText("Custom CSS");

  // Let's change the customCSS field.
  act(() => customCSSField.props.onChange(""));

  // Send form
  act(() => {
    within(configureContainer)
      .getByType("form")
      .props.onSubmit({ preventDefault: noop });
  });

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
    });
  });
});

it("renders with live configuration when configurable", async () => {
  const { advancedContainer } = await createTestRenderer();

  expect(
    within(advancedContainer).queryByLabelText("Comment Stream Live Updates")
  ).toBeDefined();
});

it("renders without live configuration when not configurable", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () =>
        pureMerge<typeof settings>(settings, {
          live: { configurable: false },
        }),
    },
  });
  const { advancedContainer } = await createTestRenderer({
    resolvers,
  });

  expect(
    within(advancedContainer).queryByLabelText("Comment Stream Live Updates")
  ).toEqual(null);
});

it("change review all user reports to enable For review queue", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () => settings,
    },
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.forReviewQueue).toEqual(true);
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { configureContainer, advancedContainer } = await createTestRenderer({
    resolvers,
  });

  const forReviewQueueBox = within(advancedContainer).getByTestID(
    "for-review-queue-config-box"
  );

  const onField = within(forReviewQueueBox).getByLabelText("On");
  act(() => onField.props.onChange(onField.props.value.toString()));

  // Send form
  act(() => {
    within(configureContainer)
      .getByType("form")
      .props.onSubmit({ preventDefault: noop });
  });

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
    });
  });
});
