import { FunctionComponent, useEffect } from "react";
import { graphql, useFragment } from "react-relay";

import { globalErrorReporter } from "coral-framework/lib/errors";

import { ErrorReporterSetUserContainer_viewer$key as ErrorReporterSetUserContainer_viewer } from "coral-stream/__generated__/ErrorReporterSetUserContainer_viewer.graphql";

interface Props {
  viewer: ErrorReporterSetUserContainer_viewer | null;
}

const ErrorReporterSetUserContainer: FunctionComponent<Props> = ({
  viewer,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment ErrorReporterSetUserContainer_viewer on User {
        id
        username
        role
      }
    `,
    viewer
  );

  useEffect(() => {
    globalErrorReporter.setUser(viewerData);
  }, [viewerData]);
  return null;
};

export default ErrorReporterSetUserContainer;
