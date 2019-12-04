import purgeMetadata from "./purgeMetadata";

it("purges metadata", () => {
  const A = {
    a: {
      s: "t",
      v: null,
      __fragments: "",
    },
    b: {
      d: {
        f: 4,
        __fragments: "",
      },
    },
    c: [
      "test",
      {
        k: 4,
        __fragments: "",
      },
    ],
    x: "yz",
  };
  const B = {
    a: {
      s: "t",
      v: null,
    },
    b: {
      d: {
        f: 4,
      },
    },
    c: [
      "test",
      {
        k: 4,
      },
    ],
    x: "yz",
  };
  expect(purgeMetadata(A)).toEqual(B);
});
