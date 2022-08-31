import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

interface Props {
  id?: string;
  url: string;
  siteID: string;
  isToggled?: boolean;
}

const ExternalMedia: FunctionComponent<Props> = ({
  id,
  url,
  siteID,
  isToggled,
}) => {
  const component = encodeURIComponent(url);
  return (
    <Frame
      id={id}
      src={`/api/external-media?url=${component}&siteID=${siteID}`}
      sandbox
      isToggled={isToggled}
      type="external_media"
    />
  );
};

export default ExternalMedia;
