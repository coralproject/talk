import sinon from "sinon";

import {
  createSinonStub,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { settings, stories } from "../../fixtures";
import create from "../create";

const createTestRenderer = async (resolver: any = {}) => {
  const resolvers = {
    ...resolver,
    Query: {
      ...resolver.Query,
      settings: sinon.stub().returns(settings),
    },
  };
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });
  return {
    testRenderer,
  };
};

it("renders app with comment stream", async () => {
  const commentsQueryStub = createSinonStub(
    s =>
      s.onFirstCall().callsFake((input: any) => {
        expectAndFail(input).toEqual({ first: 5, orderBy: "CREATED_AT_DESC" });
        return stories[0].comments;
      }),
    s =>
      s.onSecondCall().callsFake((input: any) => {
        expectAndFail(input).toEqual({
          after: null,
          first: 5,
          orderBy: "CREATED_AT_ASC",
        });
        return stories[1].comments;
      })
  );
  const storyQueryStub = createSinonStub(s =>
    s.callsFake((_: any, input: any) => {
      expectAndFail(input.id).toEqual("story-1");
      expectAndFail(input.url).toBeFalsy();
      return {
        ...stories[0],
        comments: commentsQueryStub,
      };
    })
  );

  const { testRenderer } = await createTestRenderer({
    Query: {
      story: storyQueryStub,
    },
  });

  let streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );
  const selectField = within(testRenderer.root).getByLabelText("Sort By");
  const oldestOption = within(selectField).getByText("Oldest");

  selectField.props.onChange({
    target: { value: oldestOption.props.value.toString() },
  });

  streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );
  expect(within(streamLog).toJSON()).toMatchSnapshot();
});
