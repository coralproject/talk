import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { settings, stories, userWithModMessageHistory } from "../../fixtures";
import create from "./create";

const modMessagedUser = userWithModMessageHistory;

const story = stories[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => modMessagedUser,
          stream: () => story,
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

  return {
    testRenderer,
    context,
    tabPane,
  };
}

it("shows moderation message at the top of the stream", async () => {
  const { tabPane } = await createTestRenderer();
  const modMessageCallout = within(tabPane).getByLabelText("Account Status");
  expect(
    within(modMessageCallout).queryByText(
      "Your account has been sent a message by a moderator"
    )
  ).toBeDefined();
  expect(
    within(modMessageCallout).queryByText(
      "This is a friendly reminder about our community guidelines."
    )
  ).toBeDefined();

  // can still see comment stream and add comments
  expect(within(tabPane).getByTestID("comments-allComments-log")).toBeDefined();
  expect(within(tabPane).queryByTestID("comment-reply-button")).toBeDefined();
  expect(within(tabPane).queryByTestID("comment-report-button")).toBeDefined();
  expect(within(tabPane).queryByTestID("comment-edit-button")).toBeDefined();

  // only one message shows up even if there are two messages and neither has been acknowledged
  expect(within(modMessageCallout).queryByText("first message")).toBeNull();

  // a warning still also shows up with the moderation message
  expect(
    within(modMessageCallout).queryByText(
      "Your account has been issued a warning"
    )
  ).toBeDefined();

  // the moderation message can be acknowledged
  const acknowledgeModMessageButton = within(modMessageCallout).getByText(
    "Acknowledge"
  );
  act(() => {
    acknowledgeModMessageButton.props.onClick();
  });

  // the moderation message is no longer shown once acknowledged
  expect(within(tabPane).queryByLabelText("Account Status")).toBeNull();
});
