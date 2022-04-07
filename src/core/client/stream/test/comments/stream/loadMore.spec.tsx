import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isMatch } from "lodash";
import sinon from "sinon";

import { createSinonStub } from "coral-framework/testHelpers";
import { createContext } from "coral-stream/test/create";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import { comments, settings, stories } from "../../fixtures";

const loadMoreDateCursor = "2019-07-06T18:24:00.000Z";

const createTestRenderer = async () => {
  const storyStub = {
    ...stories[0],
    comments: createSinonStub((s) =>
      s.callsFake((input: any) => {
        if (
          isMatch(input, {
            first: 20,
            orderBy: "CREATED_AT_DESC",
            after: loadMoreDateCursor,
          })
        ) {
          return {
            edges: [
              {
                node: comments[2],
                cursor: "2019-08-06T18:24:00.000Z",
              },
            ],
            pageInfo: {
              endCursor: "2019-08-06T18:24:00.000Z",
              hasNextPage: false,
            },
          };
        }

        if (
          isMatch(input, {
            first: 20,
            orderBy: "CREATED_AT_DESC",
          })
        ) {
          return {
            edges: [
              {
                node: comments[0],
                cursor: comments[0].createdAt,
              },
              {
                node: comments[1],
                cursor: loadMoreDateCursor,
              },
            ],
            pageInfo: {
              endCursor: loadMoreDateCursor,
              hasNextPage: true,
            },
          };
        }

        throw new Error("Unexpected request");
      })
    ),
  };

  const resolvers = {
    Query: {
      story: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(
              undefined,
              sinon
                .match({ id: storyStub.id, url: null })
                .or(sinon.match({ id: storyStub.id }))
            )
            .returns(storyStub)
      ),
      stream: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(
              undefined,
              sinon
                .match({ id: storyStub.id, url: null, mode: null })
                .or(sinon.match({ id: storyStub.id }))
            )
            .returns(storyStub)
      ),
      settings: sinon.stub().returns(settings),
    },
  };

  const { context } = createContext({
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue("COMMENTS", "activeTab");
      localRecord.setValue("ALL_COMMENTS", "commentsTab");
      localRecord.setValue("CREATED_AT_DESC", "commentsOrderBy");
      localRecord.setValue(storyStub.id, "storyID");
    },
  });

  customRenderAppWithContext(context);
  const stream = await screen.findByTestId("comments-allComments-log");

  return { context, stream };
};

it("rtl - renders comment stream with load more button", async () => {
  const { stream } = await createTestRenderer();

  expect(within(stream).queryByText("Load More")).toBeInTheDocument();
});

it("loads more comments", async () => {
  const { stream } = await createTestRenderer();

  // Get amount of comments before.
  const commentsBefore = within(stream).getAllByTestId(/^comment[-]comment[-]/)
    .length;

  const loadMore = within(stream).getByRole("button", {
    name: "Load More",
  });
  userEvent.click(loadMore);
  expect(within(stream).queryByText("Load More")).toBeDisabled();

  await waitFor(() =>
    expect(within(stream).getAllByTestId(/^comment[-]comment[-]/).length).toBe(
      commentsBefore + 1
    )
  );
});
