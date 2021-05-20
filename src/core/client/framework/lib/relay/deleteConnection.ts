import { RecordSourceProxy } from "relay-runtime";

/**
 * deleteConnection removes the Connection including its pageinfo and edges.
 */
function deleteConnection(source: RecordSourceProxy, connectionID: string) {
  const connection = source.get(connectionID);
  if (!connection) {
    throw new Error("unable to delete connection, connection not found");
  }
  const pageInfo = connection.getLinkedRecord("pageInfo");
  if (pageInfo) {
    source.delete(pageInfo.getDataID());
  }
  const edges = connection.getLinkedRecords("edges");
  if (edges) {
    connection.setLinkedRecords([], "edges");
    edges.forEach((e) => {
      source.delete(e.getDataID());
    });
  }
  source.delete(connectionID);
}

export default deleteConnection;
