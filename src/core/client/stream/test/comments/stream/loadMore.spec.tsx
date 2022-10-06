import { act, screen, within } from "@testing-library/react";
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
            first: 99999,
            orderBy: "CREATED_AT_DESC",
            after: loadMoreDateCursor,
          })
        ) {
          return {
            edges: [
              {
                node: comments[20],
                cursor: loadMoreDateCursor,
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
                cursor: comments[1].createdAt,
              },
              {
                node: comments[2],
                cursor: comments[2].createdAt,
              },
              {
                node: comments[3],
                cursor: comments[3].createdAt,
              },
              {
                node: comments[4],
                cursor: comments[4].createdAt,
              },
              {
                node: comments[5],
                cursor: comments[5].createdAt,
              },
              {
                node: comments[6],
                cursor: comments[6].createdAt,
              },
              {
                node: comments[7],
                cursor: comments[7].createdAt,
              },
              {
                node: comments[8],
                cursor: comments[8].createdAt,
              },
              {
                node: comments[9],
                cursor: comments[9].createdAt,
              },
              {
                node: comments[10],
                cursor: comments[10].createdAt,
              },
              {
                node: comments[11],
                cursor: comments[11].createdAt,
              },
              {
                node: comments[12],
                cursor: comments[12].createdAt,
              },
              {
                node: comments[13],
                cursor: comments[13].createdAt,
              },
              {
                node: comments[14],
                cursor: comments[14].createdAt,
              },
              {
                node: comments[15],
                cursor: comments[15].createdAt,
              },
              {
                node: comments[16],
                cursor: comments[16].createdAt,
              },
              {
                node: comments[17],
                cursor: comments[17].createdAt,
              },
              {
                node: comments[18],
                cursor: comments[18].createdAt,
              },
              {
                node: comments[19],
                cursor: comments[19].createdAt,
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
  return { context };
};

it("renders comment stream with load all comments button when more than initial number comments", async () => {
  await act(async () => {
    await createTestRenderer();
  });
  const stream = await screen.findByTestId("comments-allComments-log");
  expect(
    within(stream).queryByRole("button", { name: "Load All Comments" })
  ).toBeInTheDocument();
});
