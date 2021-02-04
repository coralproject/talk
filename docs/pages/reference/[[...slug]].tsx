import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

import ReferencePage, {
  ReferencePageProps,
} from "../../components/ReferencePage";
import { getReferences, renderReference } from "../../lib/reference";

export default function ReferencePageLayout(props: ReferencePageProps) {
  return <ReferencePage {...props} />;
}

interface Params extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticProps: GetStaticProps<
  ReferencePageProps,
  Params
> = async ({ params }) => {
  if (!params || !params.slug || !Array.isArray(params.slug)) {
    return { notFound: true };
  }

  // Unpack the params from the slug.
  const [kind, name] = params.slug;

  // Try to find the reference.
  const staticProps = await renderReference(kind, name);
  if (!staticProps) {
    return { notFound: true };
  }

  return {
    props: {
      staticProps,
    },
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const references = getReferences();

  return {
    paths: references.map(({ kind, name }) => ({
      params: {
        slug: [kind.toLowerCase(), name],
      },
    })),
    fallback: false,
  };
};
