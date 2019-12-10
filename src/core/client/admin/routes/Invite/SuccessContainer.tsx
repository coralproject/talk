import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { SuccessContainer_site } from "coral-admin/__generated__/SuccessContainer_site.graphql";

import Success from "./Success";

interface Props {
  site: SuccessContainer_site;
  token: string;
}

const SuccessContainer: FunctionComponent<Props> = ({ token, site }) => {
  return (
    <Success
      token={token}
      organizationName={site.name}
      organizationURL={site.url}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment SuccessContainer_site on Site {
      name
      url
    }
  `,
})(SuccessContainer);

export default enhanced;
