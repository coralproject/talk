import { SinonStub } from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { pureMerge } from "coral-common/utils";
import { InvalidRequestError } from "coral-framework/lib/errors";
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
  replaceHistoryLocation("http://localhost/admin/configure/general");
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
  const generalContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-generalContainer")
  );
  const saveChangesButton = within(configureContainer).getByTestID(
    "configure-sideBar-saveChanges"
  );
  return {
    context,
    testRenderer,
    configureContainer,
    generalContainer,
    saveChangesButton,
  };
}

it("renders configure general", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change language", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.locale).toEqual("es");
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    context: { changeLocale },
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({ resolvers });

  const languageField = within(generalContainer).getByLabelText("Language");

  // Let's change the language.
  act(() => languageField.props.onChange("es"));

  // Send form
  await act(async () => {
    await within(configureContainer).getByType("form").props.onSubmit();
  });

  // Submit button and text field should be disabled.
  await wait(() => {
    expect(saveChangesButton.props.disabled).toBe(true);
  });

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
    });
  });

  // Wait for client to change language.
  await wait(() => {
    expect((changeLocale as SinonStub).called).toBe(true);
  });
});

it("change site wide commenting", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.disableCommenting).toEqual({
          enabled: true,
          message: "Closing message",
        });
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
  });

  const sitewideCommentingContainer = within(
    generalContainer
  ).getAllByText("Sitewide commenting", { selector: "fieldset" })[0];

  const offField = within(sitewideCommentingContainer).getByLabelText(
    "Off - Comment streams closed for new comments"
  );
  const contentField = within(sitewideCommentingContainer).getByLabelText(
    "Sitewide closed comments message"
  );

  // Let's enable it.
  act(() => offField.props.onChange(offField.props.value.toString()));

  // Let's change the content.
  act(() => contentField.props.onChange("Closing message"));

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(offField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(offField.props.disabled).toBe(false);
    });
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change community guidlines", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.communityGuidelines!.content).toEqual(
          "This is the community guidlines summary"
        );
        expectAndFail(variables.settings.communityGuidelines!.enabled).toEqual(
          true
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });

  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
  });

  const guidelinesContainer = within(
    generalContainer
  ).getAllByText("Community guidelines summary", { selector: "fieldset" })[0];

  const onField = within(guidelinesContainer).getByLabelText("On");
  const contentField = within(guidelinesContainer).getByLabelText(
    "Community guidelines summary"
  );

  // Let's enable it.
  act(() => onField.props.onChange(onField.props.value.toString()));

  // Let's change the content.
  act(() =>
    contentField.props.onChange("This is the community guidlines summary")
  );

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(onField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(onField.props.disabled).toBe(false);
    });
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change closed stream message", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.closeCommenting!.message).toEqual(
          "The stream has been closed"
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({ resolvers });

  const contentField = within(generalContainer).getByLabelText(
    "Closed comment stream message"
  );

  // Let's change the content.
  act(() => contentField.props.onChange("The stream has been closed"));

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
    });
  });
});

it("change comment editing time", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.editCommentWindowLength).toEqual(
          108000
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({ resolvers });

  const durationFieldset = within(
    generalContainer
  ).getByText("Comment edit timeframe", { selector: "fieldset" });
  const valueField = within(durationFieldset).getByLabelText("value");
  const unitField = within(durationFieldset).getByLabelText("unit");
  const hoursOption = within(unitField).getByText(/Hours?/);

  // Let's turn on and set some invalid values.
  act(() => valueField.props.onChange({ target: { value: "" } }));

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  expect(
    within(generalContainer).queryAllByText("This field is required.").length
  ).toBe(1);

  // Let's change to sth valid.
  act(() => valueField.props.onChange({ target: { value: "30" } }));
  act(() =>
    unitField.props.onChange({
      target: { value: hoursOption.props.value.toString() },
    })
  );

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a whole number greater than or equal to 0"
    ).length
  ).toBe(0);

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
    });
  });
});

it("change comment length limitations", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.charCount).toEqual({
          enabled: true,
          min: null,
          max: 3000,
        });
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
  });

  const commentLengthContainer = within(
    generalContainer
  ).getByText("Comment length", { selector: "fieldset" });
  const onField = within(commentLengthContainer).getByLabelText("On");
  const minField = within(commentLengthContainer).getByLabelText(
    "Minimum comment length"
  );
  const maxField = within(commentLengthContainer).getByLabelText(
    "Maximum comment length"
  );

  // Let's turn on and set some invalid values.
  act(() => onField.props.onChange(onField.props.value.toString()));
  act(() => minField.props.onChange("invalid"));
  act(() => maxField.props.onChange("-1"));

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a whole number greater than 0"
    ).length
  ).toBe(2);

  // Make max smaller than min.
  act(() => minField.props.onChange("1000"));
  act(() => maxField.props.onChange("500"));

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a number longer than the minimum length"
    ).length
  ).toBe(1);

  // Let's change to sth valid.
  act(() => minField.props.onChange(""));
  act(() => maxField.props.onChange("3000"));

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a valid whole number >= 0"
    ).length
  ).toBe(0);

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(minField.props.disabled).toBe(true);
  expect(maxField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(minField.props.disabled).toBe(false);
      expect(maxField.props.disabled).toBe(false);
    });
  });
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change closing comment streams", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.closeCommenting!.auto).toEqual(true);
        expectAndFail(variables.settings.closeCommenting!.timeout).toEqual(
          2592000
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({ resolvers });

  const closingCommentStreamsContainer = within(
    generalContainer
  ).getByText("Closing comment streams", { selector: "fieldset" });
  const onField = within(closingCommentStreamsContainer).getByLabelText("On");
  const durationFieldset = within(
    closingCommentStreamsContainer
  ).getByText("Close comments after", { selector: "fieldset" });
  const valueField = within(durationFieldset).getByLabelText("value");
  const unitField = within(durationFieldset).getByLabelText("unit");
  const daysOption = within(unitField).getByText(/Days?/);

  // Let's turn on and set some invalid values.
  act(() => onField.props.onChange(onField.props.value.toString()));
  act(() => valueField.props.onChange({ target: { value: "" } }));

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  expect(
    within(generalContainer).queryAllByText("This field is required.").length
  ).toBe(1);

  // Let's change to sth valid.
  act(() => valueField.props.onChange({ target: { value: "30" } }));
  act(() =>
    unitField.props.onChange({
      target: { value: daysOption.props.value.toString() },
    })
  );

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(valueField.props.disabled).toBe(true);
  expect(unitField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(valueField.props.disabled).toBe(false);
      expect(unitField.props.disabled).toBe(false);
    });
  });
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("handle server error", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: () => {
        throw new InvalidRequestError({
          code: ERROR_CODES.INTERNAL_ERROR,
          traceID: "traceID",
        });
      },
    },
  });

  const { configureContainer, generalContainer } = await createTestRenderer({
    resolvers,
    muteNetworkErrors: true,
  });

  const contentField = within(generalContainer).getByLabelText(
    "Closed comment stream message"
  );

  // Let's change the content.
  act(() => contentField.props.onChange("The stream has been closed"));

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  // Look for internal error being displayed.
  await act(async () => {
    await waitForElement(() =>
      within(configureContainer).getByText("INTERNAL_ERROR")
    );
  });
});

it("change rte config", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.rte).toEqual({
          enabled: true,
          strikethrough: true,
          spoiler: false,
        });
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
  });

  const rteContainer = within(
    generalContainer
  ).getAllByText("Rich-text comments", { selector: "fieldset" })[0];
  const onField = within(rteContainer).getByLabelText("On", { exact: false });
  const offField = within(rteContainer).getByLabelText("Off", { exact: false });
  const strikethroughField = within(rteContainer).getByLabelText(
    "Strikethrough"
  );

  // Turn off rte will disable additional options.
  act(() => offField.props.onChange(offField.props.value.toString()));
  expect(strikethroughField.props.disabled).toBe(true);

  // Turn on rte will enable additional options.
  act(() => onField.props.onChange(onField.props.value.toString()));
  expect(strikethroughField.props.disabled).toBe(false);

  // Enable strikethrough option.
  act(() => strikethroughField.props.onChange(true));

  // Send form
  act(() => {
    within(configureContainer).getByType("form").props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(onField.props.disabled).toBe(true);
  expect(strikethroughField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(onField.props.disabled).toBe(false);
      expect(strikethroughField.props.disabled).toBe(false);
    });
  });
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});
