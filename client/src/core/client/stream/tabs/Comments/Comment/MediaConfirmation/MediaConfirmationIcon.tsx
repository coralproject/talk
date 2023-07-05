import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components/v2";

import { MediaLink } from "coral-common/helpers/findMediaLinks";
import styles from "./MediaConfirmationIcon.css";
import twitterImg from "./twitter.png";

interface Props {
  media: MediaLink;
}

const MediaConfirmationIcon: FunctionComponent<Props> = ({ media }) => {
  return (
    <>
      {media.type === "external" && <Icon>insert_photo</Icon>}
      {media.type === "youtube" && <Icon>ondemand_video</Icon>}
      {media.type === "twitter" && (
        <img className={styles.twitterIcon} src={twitterImg} alt="twitter" />
      )}
    </>
  );
};

export default MediaConfirmationIcon;
