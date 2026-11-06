import { buildSchema, execute, ExecutionResult, parse } from "graphql";

const schema = buildSchema(`
  type Query {
    asyncField: String!
    syncField: String!
  }
`);

const rootValue = {
  asyncField: () =>
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error("async error")), 0);
    }),
  syncField: () => {
    throw new Error("sync error");
  },
};

const waitForRejections = () =>
  new Promise((resolve) => setTimeout(resolve, 50));

it("handles pending field promises when a sibling field throws synchronously", async () => {
  const onUnhandledRejection = jest.fn();
  process.on("unhandledRejection", onUnhandledRejection);

  try {
    const result: ExecutionResult = await execute({
      schema,
      document: parse("{ asyncField syncField }"),
      rootValue,
    });

    await waitForRejections();

    expect(result.data).toBeNull();
    expect(result.errors?.map(({ message }) => message)).toEqual([
      "sync error",
    ]);
    expect(onUnhandledRejection).not.toHaveBeenCalled();
  } finally {
    process.off("unhandledRejection", onUnhandledRejection);
  }
});
