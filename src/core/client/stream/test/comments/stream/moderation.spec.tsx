import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import { waitFor } from "coral-common/helpers";
// import { waitFor } from "coral-common/helpers";

import { pureMerge } from "coral-common/utils";
import { GQLCOMMENT_STATUS, GQLResolver } from "coral-framework/schema";
import {
  // act,
  createResolversStub,
  CreateTestRendererParams,
  // waitForElement,
  // waitUntilThrow,
  // within,
} from "coral-framework/testHelpers";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import { featuredTag, moderators, settings, stories } from "../../fixtures";
import { createContext } from "../create";
// import create from "./create";

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
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
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
  customRenderAppWithContext(context);
  const tabPane = await screen.findByTestId("current-tab-pane");

  return {
    context,
    tabPane,
  };
}

it("render moderation view link", async () => {
  await createTestRenderer();
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  userEvent.click(caretButton);
  const link = within(comment).getByRole("link", { name: "Moderation view" });
  expect(link).toHaveAttribute(
    "href",
    `/admin/moderate/comment/${firstComment.id}`
  );
});

it("render moderate story link", async () => {
  await createTestRenderer();
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  userEvent.click(caretButton);
  const link = within(comment).getByRole("link", { name: "Moderate story" });
  expect(link).toHaveAttribute("href", `/admin/moderate/stories/${story.id}`);
});

it("feature and unfeature comment", async () => {
  await createTestRenderer({
    logNetwork: false,
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        featureComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id,
            commentRevisionID: firstComment.revision!.id,
          });
          return {
            comment: pureMerge<typeof firstComment>(firstComment, {
              tags: [featuredTag],
              status: GQLCOMMENT_STATUS.APPROVED,
            }),
          };
        },
        unfeatureComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id,
          });
          return { comment: firstComment };
        },
      },
    }),
  });
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");

  // Feature
  userEvent.click(caretButton);
  const featureButton = within(comment).getByRole("button", {
    name: "Feature",
  });
  fireEvent.click(featureButton);
  expect(within(comment).getByText("Featured")).toBeVisible();
  expect(
    within(screen.getByTestId("comments-featuredCount")).getByText("1")
  ).toBeVisible();

  // Unfeature
  userEvent.click(caretButton);
  const unfeatureButton = within(comment).getByRole("button", {
    name: "Un-feature",
  });
  fireEvent.click(unfeatureButton);
  expect(await within(comment).findByText("Featured")).not.toBeInTheDocument();
  expect(
    screen.queryByTestId("comments-featuredCount")
  ).not.toBeInTheDocument();
});

it("approve comment", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        approveComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id,
            commentRevisionID: firstComment.revision!.id,
          });
          return {
            comment: pureMerge<typeof firstComment>(firstComment, {
              status: GQLCOMMENT_STATUS.APPROVED,
            }),
          };
        },
      },
    }),
  });
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  userEvent.click(caretButton);
  const approveButton = within(comment).getByRole("button", {
    name: "Approve",
  });
  fireEvent.click(approveButton);
  expect(await within(comment).findByText("Approved")).toBeInTheDocument();
});

it("reject comment", async () => {
  const { tabPane } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        rejectComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id,
            commentRevisionID: firstComment.revision!.id,
          });
          return {
            comment: pureMerge<typeof firstComment>(firstComment, {
              status: GQLCOMMENT_STATUS.REJECTED,
            }),
          };
        },
      },
    }),
  });
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  userEvent.click(caretButton);
  const rejectButton = within(comment).getByRole("button", { name: "Reject" });
  fireEvent.click(rejectButton);
  expect(
    within(tabPane).getByText("You have rejected this comment.")
  ).toBeVisible();
  const link = within(tabPane).getByRole("link", {
    name: "Go to moderate to review this decision",
  });
  expect(link).toHaveAttribute(
    "href",
    `/admin/moderate/comment/${firstComment.id}`
  );
});

it.only("ban user", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        user: ({ variables }) => {
          expectAndFail(variables.id).toBe(firstComment.author!.id);
          // console.log(firstComment.author, "author");
          return firstComment.author!;
        },
      },
      Mutation: {
        banUser: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            userID: firstComment.author!.id,
            rejectExistingComments: false,
          });
          return {
            user: pureMerge<typeof firstComment.author>(firstComment.author, {
              status: {
                ban: {
                  active: true,
                },
              },
            }),
          };
        },
        rejectComment: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            commentID: firstComment.id,
            commentRevisionID: firstComment.revision!.id,
          });
          return {
            comment: pureMerge<typeof firstComment>(firstComment, {
              status: GQLCOMMENT_STATUS.REJECTED,
            }),
          };
        },
      },
    }),
  });
  // const comment = await waitForElement(() =>
  //   within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
  // );
  const comment = screen.getByTestId(`comment-${firstComment.id}`);
  const caretButton = within(comment).getByLabelText("Moderate");
  // act(() => {
  //   caretButton.props.onClick();
  // });
  userEvent.click(caretButton);

  // await act(async () => {
  //   const banButton = await waitForElement(() => {
  //     const el = within(comment).getByText("Ban User", {
  //       selector: "button",
  //     });
  // const banButton = await within(comment).findByRole("button", {
  //   name: "Ban User",
  // });
  await waitFor(() => {
    expect(
      within(comment).getByRole("button", { name: "Ban User" })
    ).not.toBeDisabled();
  });
  fireEvent.click(within(comment).getByRole("button", { name: "Ban User" }));
  // screen.debug(banButton);
  // await waitFor(() => {
  //   expect(banButton).not.toBeDisabled();
  // });

  //     expect(el.props.disabled).toBeFalsy();
  //     return el;
  //   });
  //   banButton.props.onClick();
  // });
  // userEvent.click(banButton);

  // await act(async () => {
  //   const banButtonDialog = within(comment).getByText("Ban", {
  //     selector: "button",
  //   });
  await screen.findByText("Ban Markus?");
  //   banButtonDialog.props.onClick();
  // });
  // userEvent.click(banButtonDialog);

  // await waitForElement(() =>
  //   within(tabPane).getByText("You have rejected this comment", {
  //     exact: false,
  //   })
  // );
  // expect(
  //   within(tabPane).getByText("You have rejected this comment.")
  // ).toBeVisible();
});

// it("cancel ban user", async () => {
//   const { testRenderer } = await createTestRenderer({
//     resolvers: createResolversStub<GQLResolver>({
//       Query: {
//         user: ({ variables }) => {
//           expectAndFail(variables.id).toBe(firstComment.author!.id);
//           return firstComment.author!;
//         },
//       },
//     }),
//   });
//   const comment = await waitForElement(() =>
//     within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
//   );
//   const caretButton = within(comment).getByLabelText("Moderate");
//   act(() => {
//     caretButton.props.onClick();
//   });

//   await act(async () => {
//     const banButton = await waitForElement(() => {
//       const el = within(comment).getByText("Ban User", {
//         selector: "button",
//       });
//       expect(el.props.disabled).toBeFalsy();
//       return el;
//     });
//     banButton.props.onClick();
//   });

//   await act(async () => {
//     const cancelButtonDialog = within(comment).getByText("Cancel", {
//       selector: "button",
//     });
//     cancelButtonDialog.props.onClick();
//   });

//   expect(
//     within(comment).queryByText("Ban", {
//       selector: "button",
//     })
//   ).toBeNull();
// });
