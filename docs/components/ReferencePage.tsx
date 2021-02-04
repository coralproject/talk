import { FunctionComponent } from "react";

import { Reference } from "../lib/reference";
import Callout from "./Callout";
import Header from "./Header";
import Layout from "./Layout";

export interface ReferencePageProps {
  staticProps: Reference;
}

const ReferencePage: FunctionComponent<ReferencePageProps> = ({
  staticProps: { pagePath, reference },
}) => {
  return (
    <Layout pagePath={pagePath}>
      <Callout />
      <article className="px-8 markdown">
        {/* FIXME: implement */}
        <Header title={reference.name} description={reference.description} />
        <p>Follows is the current introspection data for this type.</p>
        <pre className="text-xs mt-8">
          {JSON.stringify({ reference }, null, 2)}
        </pre>
      </article>
    </Layout>
  );
};

export default ReferencePage;
