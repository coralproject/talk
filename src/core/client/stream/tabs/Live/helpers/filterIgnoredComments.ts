export default function filterIgnoredComments<
  T extends ReadonlyArray<{
    readonly node: {
      readonly author: {
        readonly id: string;
      } | null;
    };
  }>
>(ignoredUsers: string[], edges: T): T {
  return edges.filter(
    (e) => !e.node.author || !ignoredUsers.includes(e.node.author.id)
  ) as any;
}
