import React, { FunctionComponent } from "react";

import { MediaLink } from "coral-common/common/lib/helpers/findMediaLinks";
import {
  BlueskyLogoIcon,
  ImageFileLandscapeIcon,
  SvgIcon,
  VideoPlayerIcon,
  XLogoTwitterIcon,
} from "coral-ui/components/icons";

interface Props {
  media: MediaLink;
}

const MediaConfirmationIcon: FunctionComponent<Props> = ({ media }) => {
  return (
    <>
      {media.type === "external" && <SvgIcon Icon={ImageFileLandscapeIcon} />}
      {media.type === "youtube" && <SvgIcon Icon={VideoPlayerIcon} />}
      {media.type === "twitter" && (
        <SvgIcon size="xs" filled="currentColor" Icon={XLogoTwitterIcon} />
      )}
      {media.type === "bluesky" && (
        <SvgIcon size="xs" filled="currentColor" Icon={BlueskyLogoIcon} />
      )}
    </>
  );
};

export default MediaConfirmationIcon;
