import React, { FunctionComponent } from "react";

import { Markdown } from "coral-framework/components";
import CLASSES from "coral-stream/classes";
import { CallOut } from "coral-ui/components";

interface Props {
  children: string;
}

const CommunityGuidelines: FunctionComponent<Props> = props => {
  return (
    <CallOut color="primary" fullWidth className={CLASSES.guidelines}>
      <Markdown>{props.children}</Markdown>
    </CallOut>
  );
};

export default CommunityGuidelines;
