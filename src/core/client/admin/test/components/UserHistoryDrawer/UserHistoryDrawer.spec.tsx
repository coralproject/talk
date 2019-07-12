import {
  createSettings,
  createStory,
  createUser,
} from "coral-test/helpers/fixture";

import { pureMerge } from "coral-common/utils";
import { GQLResolver, GQLUser, GQLUSER_ROLE } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "./create";

const viewer = createUser();
viewer.role = GQLUSER_ROLE.ADMIN;
const settings = createSettings();

async function createTestRenderer(
  user: GQLUser,
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context, subscriptionHandler } = create(
    {
      ...params,
      resolvers: pureMerge(
        createResolversStub<GQLResolver>({
          Query: {
            settings: () => settings,
            viewer: () => viewer,
            user: () => user,
          },
        }),
        params.resolvers
      ),
      initLocalState: (localRecord, source, environment) => {
        localRecord.setValue(true, "loggedIn");
        if (params.initLocalState) {
          params.initLocalState(localRecord, source, environment);
        }
      },
    },
    user
  );

  return { testRenderer, context, subscriptionHandler };
}

it("User drawer is open for user, user name is visible", async () => {
  const story = createStory();
  const user = story.comments.edges[0].node.author!;
<<<<<<< HEAD
  const { testRenderer } = await createTestRenderer(user);

  await act(async () => {
=======
  await act(async () => {
    const { testRenderer } = await createTestRenderer(user);
>>>>>>> Create unit tests around the user drawer
    const { getByText } = within(testRenderer.root);
    await waitForElement(() => getByText(user.id, { exact: false }));
  });
});

it("User drawer is open for user, user name is visible", async () => {
  const story = createStory();
  const user = story.comments.edges[0].node.author!;
<<<<<<< HEAD
  const { testRenderer } = await createTestRenderer(user);

  await act(async () => {
=======
  await act(async () => {
    const { testRenderer } = await createTestRenderer(user);
>>>>>>> Create unit tests around the user drawer
    const { getByText } = within(testRenderer.root);
    await waitForElement(() => getByText(user.username!, { exact: false }));
  });
});

it("All comments selected, comment is visible in all comments", async () => {
  const story = createStory();
  const user = story.comments.edges[0].node.author!;
  const comment = user.allComments.edges[0].node;
<<<<<<< HEAD
  const { testRenderer } = await createTestRenderer(user);

  await act(async () => {
=======
  await act(async () => {
    const { testRenderer } = await createTestRenderer(user);
>>>>>>> Create unit tests around the user drawer
    const { getByText } = within(testRenderer.root);

    await waitForElement(() => getByText(comment.body!, { exact: false }));
  });
});

it("Select rejected comments, rejected comment is visible.", async () => {
  const story = createStory();
  const user = story.comments.edges[0].node.author!;
  const rejectedComment = user.rejectedComments.edges[0].node;
<<<<<<< HEAD
  const { testRenderer } = await createTestRenderer(user);

  await act(async () => {
=======
  await act(async () => {
    const { testRenderer } = await createTestRenderer(user);
>>>>>>> Create unit tests around the user drawer
    const { getByText } = within(testRenderer.root);
    const rejectedTab = await waitForElement(() =>
      getByText("rejected", {
        selector: "button",
        exact: false,
      })
    );

    rejectedTab.props.onClick();

    await waitForElement(() =>
      getByText(rejectedComment.body!, { exact: false })
    );
  });
});
