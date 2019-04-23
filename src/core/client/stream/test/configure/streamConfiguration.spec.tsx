import { pureMerge } from "talk-common/utils";
import {
  GQLResolver,
  MutationToUpdateStorySettingsResolver,
} from "talk-framework/schema";
import {
  createMutationResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  findParentWithType,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import { moderators, settings, stories } from "../fixtures";
import create from "./create";

const viewer = moderators[0];
const story = stories[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/community");
});

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { testRenderer } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          story: ({ variables }) => {
            expectAndFail(variables).toEqual({ id: story.id, url: null });
            return story;
          },
          viewer: () => viewer,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(story.id, "storyID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );
  const applyButton = within(tabPane).getByText("Apply");
  const form = findParentWithType(applyButton, "form")!;

  return { testRenderer, tabPane, applyButton, form };
};

it("change premod", async () => {
  const updateStorySettingsStub = createMutationResolverStub<
    MutationToUpdateStorySettingsResolver
  >(({ variables }) => {
    expectAndFail(variables.settings.moderation).toEqual("PRE");
    return {
      story: pureMerge(story, { settings: variables.settings }),
    };
  });
  const { form, applyButton } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updateStorySettings: updateStorySettingsStub,
      },
    }),
  });

  const premodField = within(form).getByLabelText("Enable Pre-Moderation");

  expect(applyButton.props.disabled).toBe(true);
  // Let's enable premod.
  premodField.props.onChange({});
  expect(applyButton.props.disabled).toBe(false);

  // Send form
  form.props.onSubmit();

  expect(applyButton.props.disabled).toBe(true);
  expect(premodField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(premodField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateStorySettingsStub.called).toBe(true);
});

it("change premod links", async () => {
  const updateStorySettingsStub = createMutationResolverStub<
    MutationToUpdateStorySettingsResolver
  >(({ variables }) => {
    expectAndFail(variables.settings.premodLinksEnable).toEqual(true);
    return {
      story: pureMerge(story, { settings: variables.settings }),
    };
  });
  const { form, applyButton } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updateStorySettings: updateStorySettingsStub,
      },
    }),
  });

  const premodLinksField = within(form).getByLabelText(
    "Pre-Moderate Comments Containing Links"
  );

  expect(applyButton.props.disabled).toBe(true);
  // Let's enable premod.
  premodLinksField.props.onChange({});
  expect(applyButton.props.disabled).toBe(false);

  // Send form
  form.props.onSubmit();

  expect(applyButton.props.disabled).toBe(true);
  expect(premodLinksField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(premodLinksField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateStorySettingsStub.called).toBe(true);
});

it("change message box", async () => {
  const updateStorySettingsStub = createMutationResolverStub<
    MutationToUpdateStorySettingsResolver
  >(({ variables }) => {
    expectAndFail(variables.settings.messageBox).toEqual({
      enabled: true,
      content: "*What do you think?*",
      icon: "question_answer",
    });
    return {
      story: pureMerge(story, { settings: variables.settings }),
    };
  });
  const { form, applyButton } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updateStorySettings: updateStorySettingsStub,
      },
    }),
  });

  const enableField = within(form).getByLabelText(
    "Enable Message Box for this Stream"
  );

  expect(applyButton.props.disabled).toBe(true);
  // Let's enable premod.
  enableField.props.onChange({});
  expect(applyButton.props.disabled).toBe(false);

  // Select icon
  const iconButton = within(form).getByLabelText("question_answer");

  iconButton.props.onChange({ target: { value: iconButton.props.value } });

  // Change content.
  (await waitForElement(() =>
    within(form).getByLabelText("Write a Message")
  )).props.onChange("*What do you think?*");

  // Send form
  form.props.onSubmit();

  expect(applyButton.props.disabled).toBe(true);
  expect(enableField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(enableField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateStorySettingsStub.called).toBe(true);
});

it("remove message icon", async () => {
  const updateStorySettingsStub = createMutationResolverStub<
    MutationToUpdateStorySettingsResolver
  >(({ variables }) => {
    expectAndFail(variables.settings.messageBox).toEqual({
      enabled: true,
      content: "*What do you think?*",
      icon: null,
    });
    return {
      story: pureMerge(story, { settings: variables.settings }),
    };
  });
  const { form, applyButton } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        story: () =>
          pureMerge<typeof story>(story, {
            settings: {
              messageBox: {
                enabled: true,
                content: "*What do you think?*",
                icon: "question_answer",
              },
            },
          }),
      },
      Mutation: {
        updateStorySettings: updateStorySettingsStub,
      },
    }),
  });

  // Select icon
  const noIconButton = within(form).getByLabelText("No Icon");

  noIconButton.props.onChange({ target: { value: noIconButton.props.value } });

  // Send form
  form.props.onSubmit();

  expect(applyButton.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(updateStorySettingsStub.called).toBe(true);
  });
});
