import { FunctionComponent, useEffect } from "react";
import { graphql } from "react-relay";

import { globalErrorReporter } from "coral-framework/lib/errors";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { ErrorReporterSetUserContainer_viewer } from "coral-stream/__generated__/ErrorReporterSetUserContainer_viewer.graphql";

interface Props {
  viewer: ErrorReporterSetUserContainer_viewer | null;
}

const ErrorReporterSetUserContainer: FunctionComponent<Props> = ({
  viewer,
}) => {
  useEffect(() => {
    globalErrorReporter.setUser(viewer);
  }, [viewer]);
  return null;
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment ErrorReporterSetUserContainer_viewer on User {
      id
      username
      role
    }
  `,
})(ErrorReporterSetUserContainer);

export default enhanced;
