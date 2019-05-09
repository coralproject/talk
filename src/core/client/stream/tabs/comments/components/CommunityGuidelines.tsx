import React, { FunctionComponent } from "react";

import { Markdown } from "talk-framework/components";
import { CallOut } from "talk-ui/components";

interface Props {
  children: string;
}

const CommunityGuidelines: FunctionComponent<Props> = props => {
  return (
    <CallOut color="primary" fullWidth>
      <Markdown>{props.children}</Markdown>
    </CallOut>
  );
};

export default CommunityGuidelines;
