import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

interface Props {
  id?: string;
  url: string;
  siteID: string;
  isToggled?: boolean;
}

const YouTubeMedia: FunctionComponent<Props> = ({
  id,
  url,
  siteID,
  isToggled,
}) => {
  const component = encodeURIComponent(url);
  return (
    <Frame
      id={id}
      src={`/api/oembed?type=youtube&url=${component}&siteID=${siteID}`}
      isToggled={isToggled}
    />
  );
};

export default YouTubeMedia;
