import React, { FunctionComponent } from "react";

import { CallOut, HorizontalGutter, Typography } from "coral-ui/components";

const BannedInfo: FunctionComponent = props => {
  return (
    <CallOut fullWidth>
      <HorizontalGutter>
        <Typography variant="heading3">
          Your account has been banned from commenting.
        </Typography>
        <Typography variant="bodyCopy">
          Someone with access to your account has violated our community
          guidelines. As a result, your account has been banned. You will no
          longer be able to comment, respect or report comments. if you think
          this has been done in error, please contact our community team.
        </Typography>
      </HorizontalGutter>
    </CallOut>
  );
};

export default BannedInfo;
