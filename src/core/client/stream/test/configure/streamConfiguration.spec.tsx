import { cloneDeep, merge } from "lodash";
import sinon from "sinon";

import {
  findParentWithType,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import { meAsModerator, settings, stories } from "../fixtures";
import create from "./create";

async function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean; status?: string } = {}
) {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
      story: sinon.stub().callsFake((_: any, variables: any) => {
        expectAndFail(variables).toEqual({ id: stories[0].id, url: null });
        return stories[0];
      }),
      me: sinon.stub().returns(meAsModerator),
      ...resolver.Query,
    },
    ...resolver,
  };

  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );
  const applyButton = within(tabPane).getByText("Apply");
  const form = findParentWithType(applyButton, "form")!;

  return { testRenderer, tabPane, applyButton, form };
}

it("change premod", async () => {
  let storyRecord = cloneDeep(stories[0]);
  const updateStoryStub = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input.story.moderation).toEqual("PRE");
    storyRecord = merge(storyRecord, data.input.story);
    return {
      story: storyRecord,
      clientMutationId: data.input.clientMutationId,
    };
  });
  const { form, applyButton } = await createTestRenderer({
    Mutation: {
      updateStory: updateStoryStub,
    },
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
  expect(updateStoryStub.called).toBe(true);
});

it("change premod links", async () => {
  let storyRecord = cloneDeep(stories[0]);
  const updateStoryStub = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input.story.premodLinksEnable).toEqual(true);
    storyRecord = merge(storyRecord, data.input.story);
    return {
      story: storyRecord,
      clientMutationId: data.input.clientMutationId,
    };
  });
  const { form, applyButton } = await createTestRenderer({
    Mutation: {
      updateStory: updateStoryStub,
    },
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
  expect(updateStoryStub.called).toBe(true);
});
