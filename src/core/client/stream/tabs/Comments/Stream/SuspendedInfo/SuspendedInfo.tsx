import React, { FunctionComponent } from "react";

import {
  CallOut,
  HorizontalGutter,
  RelativeTime,
  Typography,
} from "coral-ui/components";

interface Props {
  organization: string;
  until: string;
}

const SuspendedInfo: FunctionComponent<Props> = props => {
  return (
    <CallOut fullWidth>
      <HorizontalGutter>
        <Typography variant="heading3">
          Your account has been temporarily suspended from commenting.
        </Typography>
        <Typography variant="bodyCopy">
          In accordance with {props.organization}'s' community guidelines your
          account has been temporarily suspended. While suspended you will not
          be able to comment, respect or report comments. Please rejoin the
          conversation in <RelativeTime date={props.until} />.
        </Typography>
      </HorizontalGutter>
    </CallOut>
  );
};

export default SuspendedInfo;
