import { Localized } from "@fluent/react/compat";

import CLASSES from "coral-stream/classes";
import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import styles from "./BannedInfo.css";

const BannedInfo: FunctionComponent = (props) => {
  return (
    <CallOut
      color="error"
      className={CLASSES.bannedInfo.$root}
      icon={
        <Icon size="sm" className={styles.icon}>
          block
        </Icon>
      }
      iconColor="none"
      title={
        <Localized id="comments-bannedInfo-bannedFromCommenting">
          Your account has been banned from commenting.
        </Localized>
      }
    >
      <Localized id="comments-bannedInfo-violatedCommunityGuidelines">
        <div>
          Someone with access to your account has violated our community
          guidelines. As a result, your account has been banned. You will no
          longer be able to comment, respect or report comments. If you think
          this has been done in error, please contact our community team.
        </div>
      </Localized>
    </CallOut>
  );
};

export default BannedInfo;
