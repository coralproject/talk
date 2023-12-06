import React, { FunctionComponent } from "react";

import { MediaLink } from "coral-common/common/lib/helpers/findMediaLinks";
import {
  ImageFileLandscapeIcon,
  SocialMediaTwitterIcon,
  SvgIcon,
  VideoPlayerIcon,
} from "coral-ui/components/icons";
import styles from "./MediaConfirmationIcon.css";

interface Props {
  media: MediaLink;
}

const MediaConfirmationIcon: FunctionComponent<Props> = ({ media }) => {
  return (
    <>
      {media.type === "external" && <SvgIcon Icon={ImageFileLandscapeIcon} />}
      {media.type === "youtube" && <SvgIcon Icon={VideoPlayerIcon} />}
      {media.type === "twitter" && (
        <SvgIcon
          className={styles.twitterIcon}
          filled="currentColor"
          Icon={SocialMediaTwitterIcon}
        />
      )}
    </>
  );
};

export default MediaConfirmationIcon;
