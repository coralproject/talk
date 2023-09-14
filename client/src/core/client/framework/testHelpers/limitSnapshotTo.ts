export default function limitSnapshotTo(dataTest: string, node: any) {
  if (node.props && node.props["data-testid"] === dataTest) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const result: any = limitSnapshotTo(dataTest, child);
      if (result) {
        return result;
      }
    }
  }
  return "";
}
