import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FunctionComponent } from "react";

import PageHeader from "../../components/PageHeader";
import DocumentationLayout from "../../layouts/DocumentationLayout";
import { getReferences, Reference, renderReference } from "../../lib/reference";

interface Props {
  reference: Reference;
}

const ReferencePage: FunctionComponent<Props> = ({
  reference: { type, pagePath },
}) => {
  return (
    <DocumentationLayout title={type.name} currentPagePath={pagePath}>
      {/* FIXME: implement */}
      <PageHeader title={type.name} description={type.description} />
      <div className="markdown">
        <p>Follows is the current introspection data for this type.</p>
        <pre className="text-xs mt-8">
          {JSON.stringify({ reference: type }, null, 2)}
        </pre>
      </div>
    </DocumentationLayout>
  );
};

interface Params extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const [kind, name] = params.slug;

  const reference = await renderReference(kind, name);
  if (!reference) {
    return { notFound: true };
  }

  return {
    props: {
      reference,
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

export default ReferencePage;
