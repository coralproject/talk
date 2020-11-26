import { useRouter } from "found";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";

import { ModerationQueueQuery as QueryTypes } from "coral-admin/__generated__/ModerationQueueQuery.graphql";

interface Props {}

const ModerationQueue: FunctionComponent<Props> = () => {
  const { router } = useRouter();
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query ModerationQueueQuery {
          settings {
            moderation
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (!props) {
          return null;
        }
        if (props.settings.moderation === "PRE") {
          router.replace("/admin/moderate/pending");
        } else {
          router.replace("/admin/moderate/reported");
        }
      }}
    />
  );
};

export default ModerationQueue;
