import groupBy from "lodash/groupBy";

import introspection from "../data/__generated__/introspection.json";

export const reference = groupBy(introspection.__schema.types, "kind");

export function getReferences() {
  return introspection.__schema.types;
}

export interface Reference {
  pagePath: string;
  type: {
    kind: string;
    name: string;
    description: string | null;
  };
}

export async function renderReference(
  kind: string,
  name: string
): Promise<Reference | undefined> {
  const KIND = kind.toUpperCase();
  const type = introspection.__schema.types.find(
    (t) => t.kind === KIND && t.name === name
  );
  if (!type) {
    return;
  }

  return {
    pagePath: `/reference/${kind}/${name}`,
    type,
  };
}
