// import { isMatch } from "lodash";
// import { ReactTestRenderer } from "react-test-renderer";
// import sinon from "sinon";

// import {
//   act,
//   createSinonStub,
//   wait,
//   waitForElement,
//   within,
// } from "coral-framework/testHelpers";

// import { comments, settings, stories } from "../../fixtures";
// import create from "./create";

// const loadMoreDateCursor = "2019-07-06T18:24:00.000Z";

// let testRenderer: ReactTestRenderer;
// beforeEach(() => {
//   const storyStub = {
//     ...stories[0],
//     comments: createSinonStub((s) =>
//       s.callsFake((input: any) => {
//         if (
//           isMatch(input, {
//             first: 20,
//             orderBy: "CREATED_AT_DESC",
//             after: loadMoreDateCursor,
//           })
//         ) {
//           return {
//             edges: [
//               {
//                 node: comments[2],
//                 cursor: "2019-08-06T18:24:00.000Z",
//               },
//             ],
//             pageInfo: {
//               endCursor: "2019-08-06T18:24:00.000Z",
//               hasNextPage: false,
//             },
//           };
//         }

//         if (
//           isMatch(input, {
//             first: 20,
//             orderBy: "CREATED_AT_DESC",
//           })
//         ) {
//           return {
//             edges: [
//               {
//                 node: comments[0],
//                 cursor: comments[0].createdAt,
//               },
//               {
//                 node: comments[1],
//                 cursor: loadMoreDateCursor,
//               },
//             ],
//             pageInfo: {
//               endCursor: loadMoreDateCursor,
//               hasNextPage: true,
//             },
//           };
//         }

//         throw new Error("Unexpected request");
//       })
//     ),
//   };

//   const resolvers = {
//     Query: {
//       story: createSinonStub(
//         (s) => s.throws(),
//         (s) =>
//           s
//             .withArgs(
//               undefined,
//               sinon
//                 .match({ id: storyStub.id, url: null })
//                 .or(sinon.match({ id: storyStub.id }))
//             )
//             .returns(storyStub)
//       ),
//       stream: createSinonStub(
//         (s) => s.throws(),
//         (s) =>
//           s
//             .withArgs(
//               undefined,
//               sinon
//                 .match({ id: storyStub.id, url: null, mode: null })
//                 .or(sinon.match({ id: storyStub.id }))
//             )
//             .returns(storyStub)
//       ),
//       settings: sinon.stub().returns(settings),
//     },
//   };

//   ({ testRenderer } = create({
//     // Set this to true, to see graphql responses.
//     logNetwork: false,
//     resolvers,
//     initLocalState: (localRecord) => {
//       localRecord.setValue(storyStub.id, "storyID");
//     },
//   }));
// });

// it.skip("renders comment stream with load more button", async () => {
//   const streamLog = await waitForElement(() =>
//     within(testRenderer.root).getByTestID("comments-allComments-log")
//   );

//   expect(within(streamLog).toJSON()).toMatchSnapshot();
//   await wait(() =>
//     expect(within(streamLog).queryByText("Load More")).toBeDefined()
//   );
// });

// it.skip("loads more comments", async () => {
//   const streamLog = await waitForElement(() =>
//     within(testRenderer.root).getByTestID("comments-allComments-log")
//   );

//   expect(await within(streamLog).axe()).toHaveNoViolations();

//   // Get amount of comments before.
//   const commentsBefore = within(streamLog).getAllByTestID(
//     /^comment[-]comment[-]/
//   ).length;

//   await act(async () => {
//     within(streamLog).getByText("Load More").props.onClick();
//   });

//   // Should now have one more comment
//   await wait(() =>
//     expect(within(streamLog).queryByText("Load More")).toBeNull()
//   );

//   expect(within(streamLog).getAllByTestID(/^comment[-]comment[-]/).length).toBe(
//     commentsBefore + 1
//   );
// });
it("dummy", () => {});
