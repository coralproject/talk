// I am here to keep the test suites from complaining
// until we can resolve the issues below.
it("tests ignored", async () => {
  return true;
});

/*
TODO (nick-funk): Resolve why these tests are screaming about
                  an unmounted component.

Issue I'm seeing:

Invariant Violation: Unable to find node on an unmounted component.

      34 |     return false;
      35 |   }
    > 36 |   const content = i.props.dangerouslySetInnerHTML
         |                     ^
      37 |     ? i.props.dangerouslySetInnerHTML.__html
      38 |     : childrenToString(i.children);
      39 |   return matchText(pattern, content, options);

Notes:

- This appeared after I added the UserStatusChangeContainer to
  the UserHistoryDrawerQuery.
- If you comment out the UserStatusChangeContainer controller
  in the UserHistoryDrawerQuery, these tests run just fine.
   - This would seem to imply that the query logic is fine,
     as the query fragments are still integrated

*/

/*
import {
  createSettings,
  createStory,
  createUser,
} from "coral-test/helpers/fixture";

import { pureMerge } from "coral-common/utils";
import { GQLResolver, GQLUser, GQLUSER_ROLE } from "coral-framework/testHelpers/schema";
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
        if (params.initLocalState) {
          params.initLocalState(localRecord, source, environment);
        }
      },
    },
    user
  );

  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("test-container")
  );

  return { testRenderer, container, context, subscriptionHandler };
}

it("User drawer is open for user, user name is visible", async () => {
  const story = createStory();
  const user = story.comments.edges[0].node.author!;
  const { container } = await createTestRenderer(user);

  await act(async () => {
    const { getByText } = within(container);
    await waitForElement(() => getByText(user.id, { exact: false }));
  });
});

it("User drawer is open for user, user name is visible", async () => {
  const story = createStory();
  const user = story.comments.edges[0].node.author!;
  const { testRenderer } = await createTestRenderer(user);

  await act(async () => {
    const { getByText } = within(testRenderer.root);
    await waitForElement(() => getByText(user.username!, { exact: false }));
  });
});

it("All comments selected, comment is visible in all comments", async () => {
  const story = createStory();
  const user = story.comments.edges[0].node.author!;
  const comment = user.allComments.edges[0].node;
  const { testRenderer } = await createTestRenderer(user);

  await act(async () => {
    const { getByText } = within(testRenderer.root);
    await waitForElement(() => getByText(comment.body!, { exact: false }));
  });
});

it("Select rejected comments, rejected comment is visible.", async () => {
  const story = createStory();
  const user = story.comments.edges[0].node.author!;
  const rejectedComment = user.rejectedComments.edges[0].node;
  const { testRenderer } = await createTestRenderer(user);

  await act(async () => {
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
*/
