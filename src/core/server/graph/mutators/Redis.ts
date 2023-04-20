import GraphContext from "../context";

export const Redis = (ctx: GraphContext) => ({
  flush: async (): Promise<"OK"> => {
    return ctx.redis.flushall();
  },
});
