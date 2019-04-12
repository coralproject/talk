import React, { StatelessComponent } from "react";

import { Markdown } from "talk-framework/components";
import { CallOut } from "talk-ui/components";

interface Props {
  children: string;
}

const CommunityGuidelines: StatelessComponent<Props> = props => {
  return (
    <CallOut color="primary" fullWidth>
      <Markdown>{props.children}</Markdown>
    </CallOut>
  );
};

export default CommunityGuidelines;
