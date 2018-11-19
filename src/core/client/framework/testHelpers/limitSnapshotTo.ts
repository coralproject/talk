export default function limitSnapshotTo(id: string, node: any) {
  if (node.props && node.props.id === id) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const result: any = limitSnapshotTo(id, child);
      if (result) {
        return result;
      }
    }
  }
  return "";
}
