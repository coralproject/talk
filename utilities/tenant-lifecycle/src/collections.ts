import { Document, Filter } from "mongodb";

export type DatabaseRole = "live" | "archive";

export interface CollectionSpec {
  database: DatabaseRole;
  name: string;
  tenantField: "id" | "tenantID";
  purgeOrder: number;
}

export const COLLECTIONS: readonly CollectionSpec[] = [
  {
    database: "live",
    name: "notifications",
    tenantField: "tenantID",
    purgeOrder: 10,
  },
  {
    database: "live",
    name: "seenComments",
    tenantField: "tenantID",
    purgeOrder: 20,
  },
  {
    database: "live",
    name: "dsaReports",
    tenantField: "tenantID",
    purgeOrder: 30,
  },
  {
    database: "live",
    name: "commentActions",
    tenantField: "tenantID",
    purgeOrder: 40,
  },
  {
    database: "live",
    name: "commentModerationActions",
    tenantField: "tenantID",
    purgeOrder: 50,
  },
  {
    database: "archive",
    name: "archivedCommentActions",
    tenantField: "tenantID",
    purgeOrder: 60,
  },
  {
    database: "archive",
    name: "archivedCommentModerationActions",
    tenantField: "tenantID",
    purgeOrder: 70,
  },
  {
    database: "live",
    name: "comments",
    tenantField: "tenantID",
    purgeOrder: 80,
  },
  {
    database: "archive",
    name: "archivedComments",
    tenantField: "tenantID",
    purgeOrder: 90,
  },
  {
    database: "live",
    name: "stories",
    tenantField: "tenantID",
    purgeOrder: 100,
  },
  {
    database: "live",
    name: "invites",
    tenantField: "tenantID",
    purgeOrder: 110,
  },
  { database: "live", name: "users", tenantField: "tenantID", purgeOrder: 120 },
  { database: "live", name: "sites", tenantField: "tenantID", purgeOrder: 130 },
  { database: "live", name: "tenants", tenantField: "id", purgeOrder: 140 },
] as const;

export function tenantFilter(
  spec: CollectionSpec,
  tenantID: string
): Filter<Document> {
  return { [spec.tenantField]: tenantID };
}

export function collectionKey(spec: CollectionSpec): string {
  return `${spec.database}.${spec.name}`;
}

export function purgeCollections(): CollectionSpec[] {
  return [...COLLECTIONS].sort((a, b) => a.purgeOrder - b.purgeOrder);
}
