import React, { FunctionComponent } from "react";

import { Markdown } from "coral-framework/components";
import { CallOut } from "coral-ui/components";

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
