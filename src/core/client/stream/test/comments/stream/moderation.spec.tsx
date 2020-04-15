import { pureMerge } from "coral-common/utils";
import { GQLCOMMENT_STATUS, GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  waitUntilThrow,
  within
} from "coral-framework/testHelpers";

import { featuredTag, moderators, settings, stories } from "../../fixtures";
import create from "./create";

function createStory() {
  const base = stories[0];

  for (const edge of base.comments.edges) {
    const node = edge.node;
    node.story = base;
  }

  return base;
}

const story = createStory();
const firstComment = story.comments.edges[0].node;
const viewer = moderators[0];

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
          stream: () => story
        }
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(story.id, "storyID");

      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    }
  });

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );

  return {
    testRenderer,
    context,
    tabPane
  };
}

it("render go to moderate link", async () => {
  const { testRenderer } = await createTestRenderer();
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
  );
  const caretButton = within(comment).getByLabelText("Moderate");
  caretButton.props.onClick();
  const link = within(comment).getByText("Go to Moderate", {
    selector: "a",
    exact: false
  });
  expect(link.props.href).toBe(`/admin/moderate/comment/${firstComment.id}`);
});

it("feature and unfeature comment", async () => {
  const { testRenderer } = await createTestRenderer({
    logNetwork: false,
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        featureComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id,
            commentRevisionID: firstComment.revision!.id
          });
          return {
            comment: pureMerge<typeof firstComment>(firstComment, {
              tags: [featuredTag],
              status: GQLCOMMENT_STATUS.APPROVED
            })
          };
        },
        unfeatureComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id
          });
          return { comment: firstComment };
        }
      }
    })
  });
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
  );
  const caretButton = within(comment).getByLabelText("Moderate");

  // Feature
  act(() => {
    caretButton.props.onClick();
  });
  const featureButton = await waitForElement(() =>
    within(comment).getByText("Feature", {
      selector: "button"
    })
  );
  await act(async () => {
    featureButton.props.onClick();
    await waitForElement(() =>
      within(comment).getByText("Featured", { exact: false })
    );
  });

  within(
    within(testRenderer.root).getByTestID("comments-featuredCount")
  ).getByText("1");

  // Unfeature
  act(() => {
    caretButton.props.onClick();
  });
  const UnfeatureButton = within(comment).getByText("Un-Feature", {
    selector: "button"
  });
  await act(async () => {
    UnfeatureButton.props.onClick();
    await waitUntilThrow(() =>
      within(comment).getByText("Featured", { exact: false })
    );
  });
  expect(() =>
    within(testRenderer.root).getByTestID("comments-featuredCount")
  ).toThrow();
});

it("approve comment", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        approveComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id,
            commentRevisionID: firstComment.revision!.id
          });
          return {
            comment: pureMerge<typeof firstComment>(firstComment, {
              status: GQLCOMMENT_STATUS.APPROVED
            })
          };
        }
      }
    })
  });
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
  );
  const caretButton = within(comment).getByLabelText("Moderate");
  caretButton.props.onClick();
  const approveButton = within(comment).getByText("Approve", {
    selector: "button"
  });
  approveButton.props.onClick();
  await waitForElement(() =>
    within(comment).getByText("Approved", { exact: false })
  );
});

it("reject comment", async () => {
  const { testRenderer, tabPane } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        rejectComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id,
            commentRevisionID: firstComment.revision!.id
          });
          return {
            comment: pureMerge<typeof firstComment>(firstComment, {
              status: GQLCOMMENT_STATUS.REJECTED
            })
          };
        }
      }
    })
  });
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
  );
  const caretButton = within(comment).getByLabelText("Moderate");
  caretButton.props.onClick();
  const rejectButton = within(comment).getByText("Reject", {
    selector: "button"
  });
  rejectButton.props.onClick();
  await waitForElement(() =>
    within(tabPane).getByText("You have rejected this comment", {
      exact: false
    })
  );
  const link = within(tabPane).getByText(
    "Go to Moderate to review this decision",
    { selector: "button", exact: false }
  );
  expect(link.props.href).toBe(`/admin/moderate/comment/${firstComment.id}`);
});

it("ban user", async () => {
  const { testRenderer, tabPane } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        user: ({ variables }) => {
          expectAndFail(variables.id).toBe(firstComment.author!.id);
          return firstComment.author!;
        }
      },
      Mutation: {
        banUser: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            userID: firstComment.author!.id,
            rejectExistingComments: false
          });
          return {
            user: pureMerge<typeof firstComment.author>(firstComment.author, {
              status: {
                ban: {
                  active: true
                }
              }
            })
          };
        },
        rejectComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id,
            commentRevisionID: firstComment.revision!.id
          });
          return {
            comment: pureMerge<typeof firstComment>(firstComment, {
              status: GQLCOMMENT_STATUS.REJECTED
            })
          };
        }
      }
    })
  });
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
  );
  const caretButton = within(comment).getByLabelText("Moderate");
  caretButton.props.onClick();

  await act(async () => {
    const banButton = await waitForElement(() => {
      const el = within(comment).getByText("Ban User", {
        selector: "button"
      });
      expect(el.props.disabled).toBeFalsy();
      return el;
    });
    banButton.props.onClick();
  });

  await act(async () => {
    const banButtonDialog = within(comment).getByText("Ban", {
      selector: "button"
    });
    banButtonDialog.props.onClick();
  });

  await waitForElement(() =>
    within(tabPane).getByText("You have rejected this comment", {
      exact: false
    })
  );
});

it("cancel ban user", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        user: ({ variables }) => {
          expectAndFail(variables.id).toBe(firstComment.author!.id);
          return firstComment.author!;
        }
      }
    })
  });
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
  );
  const caretButton = within(comment).getByLabelText("Moderate");
  caretButton.props.onClick();

  await act(async () => {
    const banButton = await waitForElement(() => {
      const el = within(comment).getByText("Ban User", {
        selector: "button"
      });
      expect(el.props.disabled).toBeFalsy();
      return el;
    });
    banButton.props.onClick();
  });

  await act(async () => {
    const cancelButtonDialog = within(comment).getByText("Cancel", {
      selector: "button"
    });
    cancelButtonDialog.props.onClick();
  });

  expect(
    within(comment).queryByText("Ban", {
      selector: "button"
    })
  ).toBeNull();
});
