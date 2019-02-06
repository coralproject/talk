import { getPageInfo } from "./connection";

it("handles when there is none requested", () => {
  const pageInfo = getPageInfo({ first: 0 }, []);

  expect(pageInfo).toEqual({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  });
});

it("handles when there is no edges", () => {
  const pageInfo = getPageInfo({ first: 10 }, []);

  expect(pageInfo).toEqual({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  });
});

it("handles when there is more edges than requested", () => {
  const pageInfo = getPageInfo({ first: 1 }, [
    {
      node: null,
      cursor: 1,
    },
    {
      node: null,
      cursor: 2,
    },
  ]);

  expect(pageInfo).toEqual({
    hasNextPage: true,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: 1,
  });
});

it("handles when there is exactly as many edges as requested", () => {
  const pageInfo = getPageInfo({ first: 1 }, [
    {
      node: null,
      cursor: 1,
    },
  ]);

  expect(pageInfo).toEqual({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: 1,
  });
});
