import RTE from "@coralproject/rte";
import { ReactTestInstance } from "react-test-renderer";
import sinon from "sinon";
import timekeeper from "timekeeper";

import { ERROR_CODES } from "coral-common/errors";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "coral-framework/lib/errors";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  createSinonStub,
  findParentWithType,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { baseComment, commenters, settings, stories } from "../../fixtures";
import create from "./create";

async function createTestRenderer(
  resolver: any,
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon.stub().returns(settings),
      viewer: sinon.stub().returns(commenters[0]),
      stream: sinon.stub().callsFake((_: any, variables: any) => {
        expectAndFail(variables.id).toBe(stories[0].id);
        return stories[0];
      }),
      ...resolver.Query,
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );

  const rte = await waitForElement(
    () =>
      findParentWithType(
        within(tabPane).getByLabelText("Post a comment"),
        // We'll use the RTE component here as an exception because the
        // jsdom does not support all of what is needed for rendering the
        // Rich Text Editor.
        RTE
      )!
  );
  const form = findParentWithType(rte, "form")!;

  return {
    testRenderer,
    context,
    tabPane,
    rte,
    form,
  };
}

it("post a comment", async () => {
  const { rte, form, tabPane } = await createTestRenderer({
    Mutation: {
      createComment: sinon.stub().callsFake((_, data) => {
        expectAndFail(data).toMatchObject({
          input: {
            storyID: stories[0].id,
            body: "<b>Hello world!</b>",
          },
        });
        return {
          edge: {
            cursor: "",
            node: {
              ...baseComment,
              id: "comment-x",
              author: commenters[0],
              body: "<b>Hello world! (from server)</b>",
            },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
    },
  });

  await act(() => rte.props.onChange("<b>Hello world!</b>"));

  timekeeper.freeze(new Date(baseComment.createdAt));
  await act(() => form.props.onSubmit());
  timekeeper.reset();

  // Test optimistic response.
  expect(
    within(within(tabPane).queryAllByTestID(/^comment-/)[0]).toJSON()
  ).toMatchSnapshot("optimistic response");

  // Test for server response.
  await waitForElement(() =>
    within(within(tabPane).queryAllByTestID(/^comment-/)[0]).getByText(
      "<b>Hello world! (from server)</b>"
    )
  );
});

const postACommentAndHandleNonPublishedComment = async (
  dismiss: (form: ReactTestInstance, rte: ReactTestInstance) => void
) => {
  const { rte, form } = await createTestRenderer({
    Mutation: {
      createComment: sinon.stub().callsFake((_, data) => {
        expectAndFail(data).toMatchObject({
          input: {
            storyID: stories[0].id,
            body: "<b>Hello world!</b>",
          },
        });
        return {
          edge: {
            cursor: "",
            node: {
              ...baseComment,
              id: "comment-x",
              status: "SYSTEM_WITHHELD",
              author: commenters[0],
              body: "<b>Hello world!</b>",
            },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
    },
  });

  await act(() => rte.props.onChange("<b>Hello world!</b>"));
  await act(() => form.props.onSubmit());

  // Test after server response.
  await waitForElement(() =>
    within(form).getByText("will be reviewed", { exact: false })
  );

  await act(async () => {
    dismiss(form, rte);
    await wait(() =>
      expect(
        within(form).queryByText("will be reviewed", { exact: false })
      ).toBeNull()
    );
  });
};

it("post a comment and handle non-visible comment state (dismiss by click)", async () =>
  await postACommentAndHandleNonPublishedComment((form, rte) => {
    within(form).getByTestID("callout-close-button").props.onClick();
  }));

it("post a comment and handle non-visible comment state (dismiss by typing)", async () =>
  await postACommentAndHandleNonPublishedComment((form, rte) => {
    rte.props.onChange("Typing...");
  }));

it("post a comment and handle server error", async () => {
  await act(async () => {
    const { form, rte } = await createTestRenderer(
      {
        Mutation: {
          createComment: sinon.stub().callsFake(() => {
            throw new InvalidRequestError({
              code: ERROR_CODES.INTERNAL_ERROR,
              traceID: "traceID",
            });
          }),
        },
      },
      { muteNetworkErrors: true }
    );

    rte.props.onChange("<b>Hello world!</b>");
    form.props.onSubmit();

    // Look for internal error being displayed.
    await waitForElement(() => within(form).getByText("INTERNAL_ERROR"));
  });
});

it("handle moderation nudge error", async () => {
  const { form, rte } = await createTestRenderer(
    {
      Mutation: {
        createComment: createSinonStub(
          (s) =>
            s.onFirstCall().callsFake((_, data) => {
              expectAndFail(data).toMatchObject({
                input: {
                  storyID: stories[0].id,
                  body: "<b>Hello world!</b>",
                  nudge: true,
                },
              });
              throw new ModerationNudgeError({
                code: ERROR_CODES.TOXIC_COMMENT,
                traceID: "traceID",
              });
            }),
          (s) =>
            s.onSecondCall().callsFake((_, data) => {
              expectAndFail(data).toMatchObject({
                input: {
                  storyID: stories[0].id,
                  body: "<b>Hello world!</b>",
                  nudge: false,
                },
              });
              return {
                edge: {
                  cursor: "",
                  node: {
                    ...baseComment,
                    id: "comment-x",
                    status: "SYSTEM_WITHHELD",
                    author: commenters[0],
                    body: "<b>Hello world!</b>",
                  },
                },
                clientMutationId: data.input.clientMutationId,
              };
            })
        ),
      },
    },
    { muteNetworkErrors: true }
  );

  await act(() => rte.props.onChange("<b>Hello world!</b>"));
  await act(() => form.props.onSubmit());

  // Look for internal error being displayed.
  await waitForElement(() => within(form).getByText("TOXIC_COMMENT"));

  // Try again, now nudging should be disabled.
  await act(() => form.props.onSubmit());

  // Comment should now go to moderation.
  await waitForElement(() =>
    within(form).getByText("will be reviewed", { exact: false })
  );
});

it("handle disabled commenting error", async () => {
  let createCommentCalled = false;
  const { rte, form } = await createTestRenderer(
    createResolversStub<GQLResolver>({
      Mutation: {
        createComment: () => {
          createCommentCalled = true;
          throw new InvalidRequestError({
            code: ERROR_CODES.COMMENTING_DISABLED,
            traceID: "traceID",
          });
        },
      },
      Query: {
        settings: () => {
          if (!createCommentCalled) {
            return settings;
          }
          return {
            ...settings,
            disableCommenting: {
              enabled: true,
              message: "commenting disabled",
            },
          };
        },
      },
    }),
    { muteNetworkErrors: true }
  );

  await act(() => rte.props.onChange("abc"));
  await act(() => form.props.onSubmit());
  await waitForElement(() => within(form).getByText("commenting disabled"));

  expect(rte.props.disabled).toBe(true);
  expect(within(form).getByText("Submit").props.disabled).toBe(true);
});

it("handle story closed", async () => {
  let returnStory = stories[0];
  const { rte, form } = await createTestRenderer(
    {
      Mutation: {
        createComment: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({
            code: ERROR_CODES.STORY_CLOSED,
            traceID: "traceID",
          });
        }),
      },
      Query: {
        story: sinon.stub().callsFake(() => returnStory),
      },
    },
    { muteNetworkErrors: true }
  );

  // await act(() => );
  await act(async () => {
    rte.props.onChange("abc");
    form.props.onSubmit();

    // Change the story that we return to be closed.
    returnStory = { ...stories[0], isClosed: true };

    await waitForElement(() => within(form).getByText("Story is closed"));
  });

  expect(rte.props.disabled).toBe(true);
  expect(within(form).getByText("Submit").props.disabled).toBe(true);
});

// TODO: (wyattjoh) convert to integration test
// it("renders correctly", async () => {
//   const props = createDefaultProps();
//   const wrapper = shallow(<PostCommentFormContainerN {...props} />);

//   act(() => {
//     wrapper.update();
//   });

//   await act(async () => {
//     await wait(() => {
//       expect(wrapper).toMatchSnapshot();
//     });
//   });
// });

// TODO: (wyattjoh) convert to integration test
// it("renders with initialValues", async () => {
//   const props = createDefaultProps();
//   await act(async () => {
//     await props.sessionStorage.setItem(contextKey, "Hello World!");
//   });
//   const wrapper = shallow(<PostCommentFormContainerN {...props} />);

//   act(() => {
//     wrapper.update();
//   });

//   await act(async () => {
//     await wait(() => {
//       expect(wrapper).toMatchSnapshot();
//     });
//   });
// });

// TODO: (wyattjoh) convert to integration test
// it("save values", async () => {
//   const props = createDefaultProps();

//   await props.sessionStorage.setItem(contextKey, "Hello World!");

//   const wrapper = shallow(<PostCommentFormContainerN {...props} />);
//   await waitFor();

//   act(() => {
//     wrapper.update();
//   });
//   act(() => {
//     wrapper
//       .first()
//       .props()
//       .onChange({ values: { body: "changed" } });
//   });

//   await act(async () => {
//     await wait(async () =>
//       expect(await props.sessionStorage.getItem(contextKey)).toBe("changed")
//     );
//   });
// });

// TODO: (wyattjoh) convert to integration test
// it("creates a comment", async () => {
//   const storyID = "story-id";
//   const input = { body: "Hello World!" };
//   const createCommentStub = sinon.stub().returns({ edge: { node: {} } });
//   const form = createForm({ onSubmit: noop });

//   const props = createDefaultProps({
//     createComment: createCommentStub,
//     story: {
//       id: storyID,
//       isClosed: false,
//     },
//     commentsOrderBy: "CREATED_AT_ASC",
//   });

//   await act(async () => {
//     await props.sessionStorage.setItem(contextKey, "Hello World!");
//   });

//   const wrapper = shallow(<PostCommentFormContainerN {...props} />);
//   await waitFor();

//   act(() => {
//     wrapper.update();
//   });
//   act(() => {
//     wrapper.first().props().onSubmit(input, form);
//   });

//   await act(async () => {
//     await wait(() =>
//       expect(
//         createCommentStub.calledWith({
//           ...input,
//           storyID,
//           nudge: true,
//           commentsOrderBy: "CREATED_AT_ASC",
//           media: undefined,
//         })
//       ).toBeTruthy()
//     );
//   });
// });

// TODO: (wyattjoh) convert to integration test
// it("renders when story has been closed (collapsing)", async () => {
//   const props = createDefaultProps({
//     story: {
//       isClosed: true,
//     },
//     settings: {
//       closeCommenting: {
//         message: "story closed",
//       },
//     },
//   });
//   const wrapper = shallow(<PostCommentFormContainerN {...props} />);
//   await waitFor();

//   act(() => {
//     wrapper.update();
//   });

//   await act(async () => {
//     await wait(() => expect(wrapper).toMatchSnapshot());
//   });
// });

// TODO: (wyattjoh) convert to integration test
// it("renders when commenting has been disabled (collapsing)", async () => {
//   const props = createDefaultProps({
//     settings: {
//       disableCommenting: {
//         enabled: true,
//         message: "commenting disabled",
//       },
//     },
//   });
//   const wrapper = shallow(<PostCommentFormContainerN {...props} />);
//   await waitFor();

//   act(() => {
//     wrapper.update();
//   });

//   await act(async () => {
//     await wait(() => expect(wrapper).toMatchSnapshot());
//   });
// });

// TODO: (wyattjoh) convert to integration test
// it("renders when story has been closed (non-collapsing)", async () => {
//   const props = createDefaultProps({
//     story: {
//       isClosed: false,
//     },
//     settings: {
//       closeCommenting: {
//         message: "story closed",
//       },
//     },
//   });
//   const nextProps = createDefaultProps({
//     story: {
//       isClosed: true,
//     },
//     settings: {
//       closeCommenting: {
//         message: "story closed",
//       },
//     },
//   });
//   const wrapper = shallow(<PostCommentFormContainerN {...props} />);
//   await waitFor();

//   act(() => {
//     wrapper.setProps(nextProps);
//   });

//   await act(async () => {
//     await wait(() => expect(wrapper).toMatchSnapshot());
//   });
// });

// TODO: (wyattjoh) convert to integration test
// it("renders when commenting has been disabled (non-collapsing)", async () => {
//   const props = createDefaultProps({
//     settings: {
//       disableCommenting: {
//         enabled: false,
//         message: "commenting disabled",
//       },
//     },
//   });
//   const nextProps = createDefaultProps({
//     settings: {
//       disableCommenting: {
//         enabled: true,
//         message: "commenting disabled",
//       },
//     },
//   });
//   const wrapper = shallow(<PostCommentFormContainerN {...props} />);
//   await waitFor();

//   act(() => {
//     wrapper.setProps(nextProps);
//   });

//   await act(async () => {
//     await wait(() => expect(wrapper).toMatchSnapshot());
//   });
// });

// TODO: (wyattjoh) convert to integration test
// it("renders when user is scheduled to be deleted", async () => {
//   const props = createDefaultProps({
//     viewer: {
//       scheduledDeletionDate: new Date("2019-01-01").toISOString(),
//     },
//   });
//   const wrapper = shallow(<PostCommentFormContainerN {...props} />);
//   await waitFor();

//   await act(async () => {
//     await wait(() => expect(wrapper).toMatchSnapshot());
//   });
// });
