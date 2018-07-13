import { getPageInfo } from "./connection";

it("handles when there is no edges", () => {
  const pageInfo = getPageInfo({ first: 10 }, []);

  expect(pageInfo).toEqual({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  });
});
