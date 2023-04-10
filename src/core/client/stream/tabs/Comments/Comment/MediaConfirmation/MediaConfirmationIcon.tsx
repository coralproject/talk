import React, { FunctionComponent } from "react";

import { MediaLink } from "coral-common/helpers/findMediaLinks";
import {
  ImageFileLandscapeIcon,
  SvgIcon,
  TwitterIcon,
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
        <SvgIcon className={styles.twitterIcon} filled Icon={TwitterIcon} />
      )}
    </>
  );
};

export default MediaConfirmationIcon;
